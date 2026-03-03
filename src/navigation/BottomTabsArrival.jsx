import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ArrivalScreen from '../screens/Arrival/Arrival';
import OntheWay from '../screens/Arrival/ontheway';
import Setting from '../screens/Reg/Setting';

const Tab = createBottomTabNavigator();

const BottomTabsArrival = () => {
  const insets = useSafeAreaInsets(); // 👈 important

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f2027',
          borderTopColor: '#0f2027',
          height: 60 + insets.bottom,   // 👈 dynamic height
          paddingBottom: insets.bottom, // 👈 prevents overlap
        },
        tabBarActiveTintColor: '#18b4aa',
        tabBarInactiveTintColor: '#aaa',
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'OntheWay':
              iconName = 'truck-delivery-outline';
              break;
            case 'ArrivalScreen':
              iconName = 'map-marker-check-outline';
              break;
            case 'Settings':
              iconName = 'cog-outline';
              break;
            default:
              iconName = 'circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen
        name="OntheWay"
        component={OntheWay}
        options={{ title: 'On the Way' }}
      />
      <Tab.Screen
        name="ArrivalScreen"
        component={ArrivalScreen}
        options={{ title: 'Arrival' }}
      />
      <Tab.Screen
        name="Settings"
        component={Setting}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsArrival;