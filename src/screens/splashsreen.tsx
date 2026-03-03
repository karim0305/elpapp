import React, { useEffect } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import { getDeviceByImei, getMillInfoById, getElpById } from '../api/elpApi';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootParamList } from '../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Replace 'splash.gif' with the correct filename that exists in your assets folder
// For example, if you have splash.png instead:
// import splashImage from '../assets/splash.png';
// import splashImage from '../assets/splash.gif';

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootParamList>>();

useEffect(() => {
  const initApp = async () => {
    try {
      const imei = DeviceInfo.getUniqueIdSync();
      const response = await getDeviceByImei(imei);
      const device = response.data;
      console.log('Device found:', device.status);

      // Device exists but NOT active
      if (device.status !== 'active') {
        Toast.show({
          type: 'error',
          text1: 'Device Deactivated',
          text2: `Your device is not active.\nIMEI: ${imei}\nPlease contact the administrator.`,
          visibilityTime: 10000,
        });
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

      // fetch additional configuration using stored ids
      try {
        if (device.millid) {
          const millRes = await getMillInfoById(device.millid);
          await AsyncStorage.setItem('millInfo', JSON.stringify(millRes.data));
        }
        if (device.elpid) {
          const elpRes = await getElpById(device.elpid);
          await AsyncStorage.setItem('elpInfo', JSON.stringify(elpRes.data));
        }
      } catch (cfgError) {
        console.warn('Failed to load configuration data', cfgError);
      }


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
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again.',
          visibilityTime: 4000,
        });
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
      {/* <Image source={splashImage} style={{ width: 150, height: 150, marginBottom: 20 }} />   */}
      <Text style={styles.title}>ELP System</Text>
      <Text style={styles.subtitle}>Smart • Fast • Reliable</Text>
      <Text style={styles.subtitle}>The Future Tech. Solution</Text>
      <Text style={styles.subtitle}>03052166901</Text>

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
