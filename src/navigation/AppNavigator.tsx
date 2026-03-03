import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './../screens/splashsreen';
import RegisterModeScreen from '../screens/devicedetail';
import BottomTabs from './BottomTabs';
import BottomTabsArrival from './BottomTabsArrival';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="deficedetail" component={RegisterModeScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="MainTabsArrival" component={BottomTabsArrival} />

    </Stack.Navigator>
  );
};

export default AppNavigator;
