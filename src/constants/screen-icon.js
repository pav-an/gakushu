import { createElement } from 'react';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';

const screenIcons = {
  Home: {
    type: AntDesign,
    name: 'home',
  },
  ListCalendar: {
    type: AntDesign,
    name: 'calendar',
  },
  Profile: {
    type: AntDesign,
    name: 'user',
  },
  ListQuestion: {
    type: FontAwesome,
    name: 'question-circle',
  },
  ListCategory: {
    type: Ionicons,
    name: 'ios-folder',
  },
  ListTag: {
    type: Ionicons,
    name: 'ios-pricetag',
  },
};

export default (routeName, tintColor) => {
  const screenIcon = screenIcons[ routeName ];
  if (!screenIcon) {
    return null;
  }
  return createElement(screenIcon.type, {
    name: screenIcon.name,
    size:25,
    color: tintColor,
  });
};

