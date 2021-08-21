/**
 * @format
 */

import 'react-native-gesture-handler';
import React, { Component } from 'react';
import CameraIntent from './src/CameraIntent';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Home';
const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CameraIntent" component={CameraIntent} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default App;
