import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getArrivals, getRegForArrival, getRegistrationsByMill } from '../../api/elpApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArrivalScreen from './Arrival';

const OntheWay = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRegId, setSelectedRegId] = useState<string | null>(null);

  useEffect(() => {
    fetchOntheWay();
  }, []);

 const fetchOntheWay = async () => {
  const storedMillId = await AsyncStorage.getItem('millid');
  const storedDeviceId = await AsyncStorage.getItem('deviceId');
  console.log('Stored MillId:', storedMillId, 'Stored DeviceId:', storedDeviceId);
  if (!storedMillId) {
    console.warn('MillId missing');
    return;
  }

  try {
    setLoading(true);
 
    // 🔹 fetch both APIs
    const [regRes, arrivalRes] = await Promise.all([
      getRegistrationsByMill(storedMillId, storedDeviceId || ''),
      getArrivals(),
    ]);

    const registrations = regRes.data || [];
    const arrivals = arrivalRes.data || [];
console.log('Fetched Registrations:', registrations);

    // 🔹 collect regids that already arrived
    const arrivedRegIds = new Set(
      arrivals.map((item) => item.regid)
    );

    // 🔹 filter out registrations already in arrival DB
    const filtered = registrations.filter(
      (item) =>
        item.status === 'Accepted' &&
        !arrivedRegIds.has(item.regid)
    );

    setData(filtered);

    console.log('Filtered Registrations:', filtered);
  } catch (error) {
    console.log('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};


  // 🔍 Filter: remove Pending and optionally search by regid
const filteredData = data.filter(
  (item) =>
    !searchText ||
    item.regid?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.vehicleNumber?.toLowerCase().includes(searchText.toLowerCase())
);


  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>On The Vehicles</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search Registration No."
        placeholderTextColor="#bbb"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.tableHeader}>
        <Text style={[styles.columnText, styles.colRegistration]}>
          REG NO.
        </Text>
        <Text style={[styles.columnText, styles.colVehicle]}>
          VEHICLE NO.
        </Text>
        {/* <Text style={[styles.columnText, styles.colStatus]}>STATUS</Text> */}
        <Text style={[styles.columnText, styles.colStatus]}>ACTION</Text>
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

      {/* <Text
        style={[
          styles.cellText,
          styles.colStatus,
          { color: item.status === 'Accepted' ? '#4caf50' : '#ff9800' },
        ]}
      >
        {item.status}
      </Text> */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          setSelectedRegId(item.regid);
          setModalVisible(true);
        }}
      >
        <Icon name="camera" size={20} color="white" />
      </TouchableOpacity>


      
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
    <>
      <SafeAreaView style={styles.container}>
        {renderHeader()}

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      </SafeAreaView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <ArrivalScreen
           regid={selectedRegId}
           
            onSuccess={() => {
        setModalVisible(false);   // ✅ close modal
        setSelectedRegId(null);   // optional cleanup
        fetchOntheWay();          // ✅ refresh list
      }}
           
           
           />
        </View>
      </Modal>
    </>
  );
};

export default OntheWay;

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
  submitButton: { backgroundColor: '#000', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4, marginLeft: 10 },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  closeButton: { backgroundColor: '#000', padding: 12, alignItems: 'center' },
  closeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
