import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import VehicleRegistration from '../screens/Reg/VehicleRegistration';
import Registrations from '../screens/Reg/ViewRegistrations';
import Setting from '../screens/Reg/Setting';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f2027',
          borderTopColor: '#0f2027',
          height: 60 + insets.bottom,   // ✅ Adjust automatically
          paddingBottom: insets.bottom, // ✅ Prevent overlap
        },
        tabBarActiveTintColor: '#18b4aa',
        tabBarInactiveTintColor: '#aaa',
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'RegisterVehicle':
              iconName = 'car';
              break;
            case 'Registrations':
              iconName = 'file-document-multiple-outline';
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
        name="Settings"
        component={Setting}
        options={{ title: 'Settings' }}
      />
      <Tab.Screen
        name="RegisterVehicle"
        component={VehicleRegistration}
        options={{ title: 'Register Vehicle' }}
      />
      <Tab.Screen
        name="Registrations"
        component={Registrations}
        options={{ title: 'Registrations' }}
      />
      
    </Tab.Navigator>
  );
};

export default BottomTabs;