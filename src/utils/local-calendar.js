import * as CalendarUtils from './calendar';
import LocalStorage from './local-storage';

class LocalCalendar {
  calendarId;

  createCalendarIfNotExists = async () => {
    if (this.calendarId) {
      return;
    }
    const calendar = await CalendarUtils.createCalendarIfNotExists();
    this.calendarId = calendar.id;
  }

  reconciliation = async objs => {
    await this.createCalendarIfNotExists();
    const store = await LocalStorage.get();

    const promises = [];
    objs.forEach(obj => {
      const eventIds = store[ obj.id ];
      if (eventIds) {
        return;
      }
      const promise = CalendarUtils.createEvent(this.calendarId, obj)
        .then(eventIds => {
          store[ obj.id ] = eventIds;
        });
      promises.push(promise);
    });
    for (let id in store) {
      const obj = objs.find(obj => obj.id === id);
      if (obj) {
        continue;
      }
      const promise = CalendarUtils.deleteEvent(store[ id ])
        .then(() => {
          delete store[ id ];
        });
      promises.push(promise);
    }

    if (promises.length === 0) {
      return;
    }
    await Promise.all(promises);
    await LocalStorage.save(store);
  }
}

export default new LocalCalendar();
