import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ArrivalScreen from '../screens/Arrival/Arrival';
import OntheWay from '../screens/Arrival/ontheway';
import Setting from '../screens/Reg/Setting';

const Tab = createBottomTabNavigator();

const BottomTabsArrival = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f2027',
          borderTopColor: '#0f2027',
          height: 70,        // Increased height to give more space
          paddingBottom: 100, // Added bottom padding for margin
        },
        tabBarActiveTintColor: '#18b4aa',
        tabBarInactiveTintColor: '#aaa',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'circle-outline'; // fallback icon

                     // Home icon
          if (route.name === 'RegisterVehicle') iconName = 'vehicle';            // Car plus icon for vehicle registration
          if (route.name === 'ViewRegistrations') iconName = 'file-document-multiple-outline'; // Multiple documents icon
          if (route.name === 'Settings') iconName = 'cog-outline';                // Gear icon for settings

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          paddingBottom: 5, // small bottom padding for label spacing
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="OntheWay"
        component={OntheWay}
      />
      <Tab.Screen
        name="ArrivalScreen"
        component={ArrivalScreen}
        options={{ title: 'Arrival Screen' }}
      />
     
      <Tab.Screen
        name="Settings"
        component={Setting}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsArrival;
