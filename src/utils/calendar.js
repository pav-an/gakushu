import { Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import moment from 'moment';

import { CALENDAR_EVENT_TITLE } from '../constants/index';
import { CALENDAR_LANG } from '../constants'
import { to2Digit } from './'

const CALENDAR_OPTIONS = {
  title: CALENDAR_LANG.TITLE,
  entityType: Calendar.EntityTypes.EVENT,
  color: CALENDAR_LANG.COLOR,
  name: CALENDAR_LANG.NAME,
  accessLevel: Calendar.CalendarAccessLevel.OWNER,
};

const EVENT_OPTIONS = {
  title: CALENDAR_EVENT_TITLE,
  alarms: [{
    relativeOffset: '0',
    method: Calendar.AlarmMethod.ALERT,
  }],
};

const DELETE_EVENT_OPTIONS = {
  futureEvents: true,
};

const ONE_HOUR = 3600000;

export const createCalendarIfNotExists = async () => {
  const calendars = await Calendar.getCalendarsAsync();
  const curCalendar = calendars.find(calendar => {
    return calendar.title === CALENDAR_LANG.TITLE;
  });
  if (curCalendar) {
    return Promise.resolve(curCalendar);
  }

  const newCalendar = { ...CALENDAR_OPTIONS };
  if (Platform.OS === 'ios') {
    const defaultCalendar = calendars.find(c => c.source && c.source.name === 'iCloud');
    newCalendar.sourceId = defaultCalendar.source.id
  }
  if (Platform.OS === 'android') {
    const defaultCalendar = calendars.find(c => c.accessLevel === Calendar.CalendarAccessLevel.OWNER);
    newCalendar.source = {
      name: defaultCalendar.source.name,
      isLocalAccount: true,
    };
    newCalendar.ownerAccount = defaultCalendar.ownerAccount;
  }
  return Calendar.createCalendarAsync(newCalendar);
}

function getStartTimeByDoW(doW, hour, minute) {
  let res = moment()
    .isoWeekday(doW)
    .set({ hour, minute, second: 0, millisecond: 0 });

  if (res < moment()) {
    res = res.add(1, 'weeks')
  }
  return res.valueOf();
}

function getStartTimeByHourMin (hour, minute) {
  let res = moment().set({ hour, minute, second: 0, millisecond: 0 });
  if (res < moment()) {
    res = res.add(1, 'days');
  }
  return res.valueOf();
}

function createEventByDOW (time, hour, min) {
  const activeDoW = time.split(',');
  const isDaily = activeDoW.length === 7;
  if (isDaily) {
    const startTime = getStartTimeByHourMin(hour, min);
    return [{
      startDate: startTime,
      endDate: startTime + ONE_HOUR,
      recurrenceRule: { frequency: 'daily' },
    }];
  }

  return activeDoW.map(day => {
    const doW = CALENDAR_LANG.DOW_SHORTS.indexOf(day);
    const startTime = getStartTimeByDoW(doW, hour, min);
    return {
      startDate: startTime,
      endDate: startTime + ONE_HOUR,
      recurrenceRule: { frequency: 'weekly' },
    };
  });
}

function createEventByDate(date, hour, min) {
  const startTime = moment(`${date} ${to2Digit(hour)}:${to2Digit(min)}`).valueOf();
  return [{
    startDate: startTime,
    endDate: startTime + ONE_HOUR,
  }];
}

export function createEvent(calendarId, obj) {
  const { time, type, hour, min } = obj;
  let eventObjs;
  if (type === 'date') {
    eventObjs = createEventByDate(time, hour, min);
  } else {
    eventObjs = createEventByDOW(time, hour, min);
  }
  const promises = eventObjs.map(eventObj => {
    return Calendar.createEventAsync(calendarId, {
      ...EVENT_OPTIONS,
      ...eventObj,
    });
  });
  return Promise.all(promises);
}

export function deleteEvent(eventIds) {
  const promises = eventIds.map(eventId => {
    return Calendar.deleteEventAsync(eventId, DELETE_EVENT_OPTIONS);
  })
  return Promise.all(promises);
}
