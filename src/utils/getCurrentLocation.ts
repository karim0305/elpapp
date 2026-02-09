import Geolocation from '@react-native-community/geolocation';

export const getCurrentLocation = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      {
        enableHighAccuracy: false,
        timeout: 60000,
        maximumAge: 10000,
      },
    );
  });
};
