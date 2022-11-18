import React, { Component } from 'react';

// import screens
import Start from './components/Start';
import Chat from './components/Chat';
import 'react-native-gesture-handler';

// import react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// create navigator
const Stack = createStackNavigator();
export default class App extends Component {
  
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home">
          <Stack.Screen 
            name="Home"
            component={Start}/>
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}