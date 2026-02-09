import { NativeModules } from 'react-native';
import { requestLocationPermission } from './locationPermission'; // your helper file

const { CellInfoModule } = NativeModules;

export const getCellData = async () => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    console.warn('Location permission denied. Cannot fetch cell info.');
    return [];
  }

  try {
    const data = await CellInfoModule.getCellInfo();
    console.log('Cell info:', data);
    return data;
  } catch (error) {
    console.error('Error fetching cell info:', error);
    return [];
  }
};



// Android native module (Kotlin – recommended)