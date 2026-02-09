import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import { requestLocationPermission } from '../utils/locationPermission';
import { getCurrentLocation } from '../utils/getCurrentLocation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as PaperProvider, Button, TextInput, Menu } from 'react-native-paper';
import { Platform } from 'react-native';
import { getCellData } from '../utils/getCellId';

import {
  addDevice,
  getMillInfos,
  getElps, // updated to accept millId param
} from '../api/elpApi'; // ✅ your axios helpers
 
const RegisterModeScreenInner = ({ navigation }: { navigation: any }) => {
  const [location, setLocation] = useState<any>(null);
  const [towerId, setTowerId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Mill and ELP dropdown states
  const [mills, setMills] = useState<any[]>([]);
  const [selectedMill, setSelectedMill] = useState<any>(null);
  const [elps, setElps] = useState<any[]>([]);
  const [selectedElp, setSelectedElp] = useState<any>(null);

  // Dropdown menu visibility
  const [millMenuVisible, setMillMenuVisible] = useState(false);
  const [elpMenuVisible, setElpMenuVisible] = useState(false);
  // Type dropdown (static)
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      // Request location
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        try {
          const pos = await getCurrentLocation();
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            altitude: pos.coords.altitude,
            speed: pos.coords.speed,
          });
        } catch {
          setLocation(null);
        }
      }
       // Fetch CID
// Fetch CID (after permissions)

const cellDataArray = await getCellData();
console.log('Fetched Cell Data:', cellDataArray);

const firstCell = cellDataArray[0]; // get the first object in array
const cellId = firstCell?.cellId ?? ''; // fallback to empty string if undefined
setTowerId(String(cellId));

      // Fetch mills
      try {
        const millsRes = await getMillInfos();
        setMills(millsRes.data || []);
      } catch (error) {
        console.log('Error fetching mills:', error);
        Alert.alert('Error', 'Failed to fetch mill info.');
      }
    };

    init();
  }, []);

  // Fetch ELPs from API when mill changes
  useEffect(() => {
    if (!selectedMill) return;

    const fetchElps = async () => {
      try {
        // Assuming your API supports filtering by millId: getElps(millId)
        const res = await getElps(selectedMill._id);
        setElps(res.data || []);
        setSelectedElp(null); // reset selected ELP
      } catch (error) {
        console.log('Error fetching ELPs:', error);
        Alert.alert('Error', 'Failed to fetch ELPs for selected mill.');
      }
    };

    fetchElps();
  }, [selectedMill]);

  const handleSubmit = async () => {
    if (!selectedMill || !selectedElp) {
      return Alert.alert('Validation', 'Please select Mill and ELP.');
    }

    setLoading(true);
    const netState = await NetInfo.fetch();

    const payload = {
      millid: selectedMill._id,
      elpid: selectedElp._id,
      deviceModel: DeviceInfo.getModel(),
      deviceBrand: DeviceInfo.getBrand(),
      location: location
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            altitude: location.altitude ?? null,
            speed: location.speed ?? null,
          }
        : null,
      internetStatus: netState.isConnected ?? false,
      imei: DeviceInfo.getUniqueIdSync(),
      Tawerid: towerId,
      type: selectedType ?? null,
    };

    try {
      await addDevice(payload);
      Alert.alert('Success', 'Device registered successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Splash') },
      ]);
    } catch (error) {
      console.log('Register error:', error);
      Alert.alert('Error', 'Failed to register device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>REGISTRATION MODE</Text>

      {/* Dropdowns */}
      <View style={styles.dropdownRow}>
        {/* Mill Dropdown */}
        <Menu
          visible={millMenuVisible}
          onDismiss={() => setMillMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMillMenuVisible(true)}
              style={styles.dropdownButton}
            >
              {selectedMill ? selectedMill.millName : 'Select Mill'}
            </Button>
          }
        >
          {mills.map((mill) => (
            <Menu.Item
              key={mill._id}
              onPress={() => {
                setSelectedMill(mill);
                setMillMenuVisible(false);
              }}
              title={mill.millcode}
            />
          ))}
        </Menu>

        {/* ELP Dropdown */}
        <Menu
          visible={elpMenuVisible}
          onDismiss={() => setElpMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setElpMenuVisible(true)}
              style={styles.dropdownButton}
              disabled={!elps.length} // disable if no ELPs
            >
              {selectedElp ? selectedElp.elpName : 'Select ELP'}
            </Button>
          }
        >
          {elps.map((elp) => (
            <Menu.Item
              key={elp._id}
              onPress={() => {
                setSelectedElp(elp);
                setElpMenuVisible(false);
              }}
              title={elp.elpName}
            />
          ))}
        </Menu>
      </View>

      {/* Lat/Long */}
      <View style={styles.row}>
        <View style={styles.box}>
          <Icon name="map-marker" size={20} color="#0f2027" />
          <Text style={styles.boxText}>
            Lat: {location?.latitude?.toFixed(5) ?? '--'}
          </Text>
        </View>
        <View style={styles.box}>
          <Icon name="map-marker" size={20} color="#0f2027" />
          <Text style={styles.boxText}>
            Long: {location?.longitude?.toFixed(5) ?? '--'}
          </Text>
        </View>
      </View>

<View style={styles.dropdownRow}>
 {/* type Dropdown */}
        <Menu
          visible={typeMenuVisible}
          onDismiss={() => setTypeMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setTypeMenuVisible(true)}
              style={styles.dropdownButton}
            >
              {selectedType ? selectedType : 'Select type'}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setSelectedType('Arrival');
              setTypeMenuVisible(false);
            }}
            title="Arrival"
          />
          <Menu.Item
            onPress={() => {
              setSelectedType('Registration');
              setTypeMenuVisible(false);
            }}
            title="Registration"
          />
        </Menu>

</View>
      {/* Tower Id */}

      <View style={styles.fullBox}>
        <Icon name="tower-beach" size={20} color="#0f2027" />
        <TextInput
          label="Tower Id"
          value={towerId}
          editable={false}
          mode="outlined"
          onChangeText={setTowerId}
          style={styles.textInput}
          keyboardType="numeric"
          theme={{ colors: { primary: '#0f2027', text: '#0f2027' } }}
        />
      </View>

      {/* Submit Button */}
      <Button
        mode="contained"
        loading={loading}
        onPress={handleSubmit}
        style={styles.submitButton}
        contentStyle={styles.submitButtonContent}
        buttonColor="#0f2027"
      >
        Submit
      </Button>
    </ScrollView>
  );
};

const RegisterModeScreen = ({ navigation }: { navigation: any }) => (
  <PaperProvider>
    <RegisterModeScreenInner navigation={navigation} />
  </PaperProvider>
);

export default RegisterModeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dcdcdc', padding: 20 },
  header: { fontSize: 22, fontWeight: '700', letterSpacing: 1, marginBottom: 20, textAlign: 'center', color: '#0f2027' },
  dropdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  dropdownButton: { flex: 1, marginHorizontal: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#0f2027', borderRadius: 10, padding: 12, width: '48%' },
  boxText: { marginLeft: 8, fontSize: 16, color: '#0f2027' },
  fullBox: { borderWidth: 1, borderColor: '#0f2027', borderRadius: 10, padding: 8, marginBottom: 15 },
  textInput: { backgroundColor: 'transparent' },
  submitButton: { marginTop: 20, borderRadius: 8 },
  submitButtonContent: { paddingVertical: 8 },
});
