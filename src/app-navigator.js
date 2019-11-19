import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Landing from './components/landing';
import Login from './components/login';
import Register from './components/register';
import ResetPassword from './components/reset-password';
import Home from './components/home';
import Profile from './components/profile';
import ChangePassword from './components/change-password';
import ListQuestion from './components/list-question';
import Question from './components/question';
import ListCalendar from './components/list-calendar';
import Calendar from './components/calendar';
import Quiz from './components/quiz';
import Play from './components/play';
import ListCategory from './components/list-category';
import ListTag from './components/list-tag';
import { COLOR, getScreenIcon } from './constants';

const tabOptions = {
  headerMode: 'none',
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state;
      return getScreenIcon(routeName, tintColor);
    },
    tabBarVisible: !navigation.getParam('onError'),
  }),
  tabBarOptions: {
    activeTintColor: COLOR.GOVERNOR_BAY,
    inactiveTintColor: COLOR.LIGHT_GRAY,
  },
};

const Main = createBottomTabNavigator({
  Home,
  ListCalendar,
  Profile,
}, tabOptions);

const Manage = createBottomTabNavigator({
  ListCategory,
  ListTag,
  ListQuestion,
}, {
  ...tabOptions,
  backBehavior: 'none',
});

export default createStackNavigator({
  Landing,
  Login,
  Register,
  ResetPassword,
  Main,
  ChangePassword,
  Question,
  Manage,
  Calendar,
  Quiz,
  Play,
}, {
  headerMode: 'none',
});
