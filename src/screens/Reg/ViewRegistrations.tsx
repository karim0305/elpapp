import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getRegistrationsByMill } from '../../api/elpApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registrationSocket } from '../../utils/socket/RegistrationSocket';

const Registrations = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  fetchRegistrations();

  // 🟢 NEW REGISTRATION
  registrationSocket.on('registration_created', (newReg) => {
    setData((prev) => {
      // avoid duplicates
      if (prev.some((r) => r._id === newReg._id)) {
        return prev;
      }
      return [newReg, ...prev];
    });
  });

  // ✏️ UPDATE REGISTRATION
  registrationSocket.on('registration_updated', (updatedReg) => {
    setData((prev) =>
      prev.map((r) =>
        r._id === updatedReg._id ? updatedReg : r,
      ),
    );
  });

  // ❌ DELETE REGISTRATION
  registrationSocket.on('registration_deleted', ({ id }) => {
    setData((prev) => prev.filter((r) => r._id !== id));
  });

  return () => {
    registrationSocket.off('registration_created');
    registrationSocket.off('registration_updated');
    registrationSocket.off('registration_deleted');
  };
}, []);

  const fetchRegistrations = async () => {
    const storedMillId = await AsyncStorage.getItem('millid');
    const storedDeviceId = await AsyncStorage.getItem('deviceId');


    console.log('Stored MillId:', storedMillId);
    console.log('Stored DeviceId:', storedDeviceId);

    if (!storedMillId || !storedDeviceId) {
      console.warn('MillId or DeviceId missing');
      return;
    }

    try {
      setLoading(true);
      const res = await getRegistrationsByMill(storedMillId, storedDeviceId);

      // 👇 assuming API returns array
      setData(res.data || []);
    } catch (error) {
      console.log('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter: remove Pending and optionally search by regid
 const filteredData = data.filter(
  (item) =>
    item.status !== 'Pending' &&
    (!searchText ||
      item.regid?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.vehicleNumber?.toLowerCase().includes(searchText.toLowerCase()))
);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Check Vehicle Registration</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search Registration No."
        placeholderTextColor="#bbb"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.tableHeader}>
        <Text style={[styles.columnText, styles.colRegistration]}>
          REGISTRATION NO.
        </Text>
        <Text style={[styles.columnText, styles.colVehicle]}>
          VEHICLE NO.
        </Text>
        <Text style={[styles.columnText, styles.colStatus]}>STATUS</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <Text style={[styles.cellText, styles.colRegistration]}>
        {item.regid}
      </Text>

      <Text style={[styles.cellText, styles.colVehicle]}>
        {item.vehicleNumber}
      </Text>

      <Text
        style={[
          styles.cellText,
          styles.colStatus,
          { color: item.status === 'Accepted' ? '#4caf50' : '#ff9800' },
        ]}
      >
        {item.status}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default Registrations;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c3c4c' },
  headerContainer: { padding: 16, backgroundColor: '#1c3c4c' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  searchInput: {
    backgroundColor: '#0f2027',
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#3d8fa3',
    paddingBottom: 8,
    marginBottom: 8,
  },
  columnText: { color: '#ccc', fontWeight: '700', fontSize: 13 },
  row: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2a6e84', paddingHorizontal: 16 },
  cellText: { color: '#eee', fontSize: 15 },
  colRegistration: { flex: 2 },
  colVehicle: { flex: 1, textAlign: 'center' },
  colStatus: { flex: 1, textAlign: 'right' },
  loader: { marginTop: 20, alignItems: 'center', justifyContent: 'center' },
});
