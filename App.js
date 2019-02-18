import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Home from './components/Home'
import Schedule from './components/Schedule'

import { createDrawerNavigator, createAppContainer } from 'react-navigation';

export default class App extends React.Component {

  render() {
    return <AppContainer />
  }
}

const DrawerNavigator = createDrawerNavigator(
    {
      Home: {
        screen: Home
      },
      Schedule: {
        screen: Schedule
      }
    },
    {
      initialRouteName: "Home"
    }
  );

// const AppContainer = createAppContainer(AppStackNavigator);
const AppContainer = createAppContainer(DrawerNavigator);

const styles = StyleSheet.create({
  text: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});