import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NavigationContainer } from '@react-navigation/native';
import SignInScreen from './screens/SignInScreen';
import Search from './screens/Search';
import Logout from './screens/Logout';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen'
import Reservation from './screens/reservation'


// Obtain instance of navigation stack
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={Search} />
      <Tab.Screen name="Reservations" component={HomeScreen} />
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen
          name="HomeScreen"
          component={Home}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Your Reservation" component={Reservation} /> 

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
