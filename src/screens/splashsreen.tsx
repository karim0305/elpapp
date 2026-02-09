import React, { useEffect } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import { getDeviceByImei } from '../api/elpApi';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootParamList } from '../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootParamList>>();

useEffect(() => {
  const initApp = async () => {
    try {
      const imei = DeviceInfo.getUniqueIdSync();
      const response = await getDeviceByImei(imei);
      const device = response.data;

      // Device exists but NOT active
      if (device.status !== 'Active') {
        Alert.alert(
          'Device Deactivated',
          `Your device is not active.\nIMEI: ${imei}\nPlease contact the administrator.`,
          [{ text: 'OK' }]
        );
        return;
      }

      // Device exists AND active → save safely
      await AsyncStorage.multiSet([
        ['imei', device.imei ?? ''],
        ['millid', device.millid ?? ''],
        ['elpid', device.elpid ?? ''],
        ['deviceId', device._id ?? ''],
        ['deviceType', device.type ?? ''],
      ]);
//     const values = await AsyncStorage.multiGet(['imei', 'millid', 'elpid', 'deviceId']);
// values.forEach(([key, value]) => {
//   console.log(`${key} = ${value}`);
// });

      if (device.type === 'Registration') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else if (device.type === 'Arrival') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabsArrival' }],
        });
      } 
    } catch (error: any) {
      console.log('SplashScreen error:', error.message);

      if (error.response?.status === 404) {
        // Device not found → navigate to registration
        navigation.reset({
          index: 0,
          routes: [{ name: 'deficedetail' }],
        });
      } else {
        // Other errors → show alert or fallback
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  initApp();
}, [navigation]);
  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={styles.container}
    >
      <Text style={styles.title}>ELP System</Text>
      <Text style={styles.subtitle}>Smart • Fast • Reliable</Text>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#dcdcdc',
  },
});
