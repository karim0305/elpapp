import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import { addArrival} from '../../api/elpApi';
import { getCurrentLocation } from '../../utils/getCurrentLocation';
import { get } from 'react-native/Libraries/NativeComponent/NativeComponentRegistry';
import { getCellData } from '../../utils/getCellId';


// Your Cloudinary info
const CLOUDINARY_UPLOAD_PRESET = 'tailorImages';
const CLOUDINARY_CLOUD_NAME = 'dzfqgziwl';
const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const ArrivalScreen = ({
  regid,
  onSuccess,
}: {
  regid?: string | null;
  onSuccess?: () => void;
}) => {
  const [millid, setMillid] = useState('');
  const [elpid, setElpid] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [imei, setImei] = useState('');
  const [gps, setGps] = useState<{ latitude: number; longitude: number } | null>(null);
  const [accuracy, setAccuracy] = useState('0');
  const [towerId, setTowerId] = useState<string>('');

  const [driverImage, setDriverImage] = useState<any>(null);
  const [vehicleImage, setVehicleImage] = useState<any>(null);
  const [permitImage, setPermitImage] = useState<any>(null);
  const [passedRegId, setPassedRegId] = useState<string | null>(regid ?? null);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    loadLocalData();
    getLocation();
    getNetworkAccuracy();
    GetTowerId();
  }, []);

  useEffect(() => {
    setPassedRegId(regid ?? null);
  }, [regid]);

  // Fetch CID
  // Fetch CID (after permissions)
  const GetTowerId = async () => {
    const cellDataArray = await getCellData();
    console.log('Fetched Cell Data:', cellDataArray);
    const firstCell = cellDataArray[0]; // get the first object in array
    const cellId = firstCell?.cellId ?? ''; // fallback to empty string if undefined
    setTowerId(String(cellId));
  }
  /* ---------------- LOAD ASYNCSTORAGE ---------------- */
  const loadLocalData = async () => {
    try {
      const storedMillId = await AsyncStorage.getItem('millid');
      const storedElpId = await AsyncStorage.getItem('elpid');
      const storedImei = await AsyncStorage.getItem('imei');
      const storedDeviceId = await AsyncStorage.getItem('deviceId');

      if (!storedMillId || !storedElpId || !storedImei || !storedDeviceId) {
        Alert.alert('Error', 'Device information missing. Please restart the app.');
        return;
      }

      setMillid(storedMillId);
      setElpid(storedElpId);
      setImei(storedImei);
      setDeviceId(storedDeviceId);
    } catch (err) {
      console.log('AsyncStorage error:', err);
    }
  };

  /* ---------------- GPS ---------------- */
  const getLocation = async () => {
    try {
      const position = await getCurrentLocation();
      setGps({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (err) {
      console.log('Location error:', err);
    }
  };

  /* ---------------- NETWORK ACCURACY ---------------- */
  const getNetworkAccuracy = async () => {
    const state = await NetInfo.fetch();
    setAccuracy(state.isConnected ? '4.30' : '0');
  };

  /* ---------------- CAMERA ---------------- */
  const openCamera = async (type: 'driver' | 'vehicle' | 'permit') => {
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.7,
    });

    if (result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      if (type === 'driver') setDriverImage(image);
      if (type === 'vehicle') setVehicleImage(image);
      if (type === 'permit') setPermitImage(image);
    }
  };

  /* ---------------- UPLOAD TO CLOUDINARY ---------------- */
  const uploadToCloudinary = async (image: any) => {
    if (!image?.uri) return null;

    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: image.type,
      name: image.fileName || 'upload.jpg',
    } as any);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_API, { method: 'POST', body: formData });
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.log('Cloudinary upload error:', err);
      return null;
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const submitArrival = async () => {
    if (!driverImage || !vehicleImage || !permitImage) {
      Alert.alert('Error', 'Please capture all images');
      return;
    }
    if (!millid || !elpid || !imei) {
      Alert.alert('Error', 'Missing device information');
      return;
    }

    try {
      // Upload images
      const [driverUrl, vehicleUrl, permitUrl] = await Promise.all([
        uploadToCloudinary(driverImage),
        uploadToCloudinary(vehicleImage),
        uploadToCloudinary(permitImage),
      ]);

      if (!driverUrl || !vehicleUrl || !permitUrl) {
        Alert.alert('Error', 'Image upload failed');
        return;
      }

      // Full payload with dummy data for required fields

      const payload = {
        millid,                  // ObjectId string from AsyncStorage
        deviceId,                // ObjectId string from AsyncStorage (device)
        regid: passedRegId ?? undefined,
        elpId: elpid,                   // ObjectId string from AsyncStorage (elp)
        gps: gps ?? undefined,   // optional GPS object { latitude, longitude }
        towerId: towerId ?? undefined,     // optional dummy data
        haulage: 'Dummy Haulage',// optional dummy data
        vehicleNumber: 'VEH123', // optional dummy data
        documentNo: 'DOC123',    // optional dummy data
        driverImage: driverUrl,  // Cloudinary URL
        vehicleImage: vehicleUrl,// Cloudinary URL
        permitImage: permitUrl,  // Cloudinary URL
        remarks: 'Test submission', // optional dummy data
        status: 'Pending',         // required
      };
      if (gps && typeof gps.latitude === 'number' && typeof gps.longitude === 'number') {
        payload.gps = gps;
      }
      console.log('Payload:', payload);

      await addArrival(payload);
        onSuccess?.();
        resetForm();
      Alert.alert('Success', 'Arrival  completed');

    } catch (err: any) {
      console.log('Submission error:', err.response || err);
      Alert.alert('Error', `Submission failed: ${err.response?.data?.message || err.message}`);
    }
  };


  const resetForm = () => ({
        millid,                  // ObjectId string from AsyncStorage
        deviceId,                // ObjectId string from AsyncStorage (device)
        regid: "",
        elpId: elpid,                   // ObjectId string from AsyncStorage (elp)
        gps:"",   // optional GPS object { latitude, longitude }
        towerId: "",     // optional dummy data
        haulage: '',// optional dummy data
        vehicleNumber: '', // optional dummy data
        documentNo: '',    // optional dummy data
        driverImage: null,  // Cloudinary URL
        vehicleImage: null,// Cloudinary URL
        permitImage: null,  // Cloudinary URL
        remarks: '', // optional dummy data
        status: 'Pending',         // required
      });


  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arrival Vehicles</Text>
      <Text style={styles.regIdText}>Reg ID: {passedRegId ?? '--'}</Text>

      <View style={styles.imageRow}>
        <TouchableOpacity onPress={() => openCamera('driver')}>
          {driverImage ? (
            <Image source={{ uri: driverImage.uri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openCamera('vehicle')}>
          {vehicleImage ? (
            <Image source={{ uri: vehicleImage.uri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openCamera('permit')}>
          {permitImage ? (
            <Image source={{ uri: permitImage.uri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.accuracyText}>Accuracy: {accuracy}</Text>

      <TouchableOpacity style={styles.submitButton} onPress={submitArrival}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ArrivalScreen;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c3c4c',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 8 },
  regIdText: { color: '#fff', fontSize: 16, alignSelf: 'flex-start', marginBottom: 12 },
  imageRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  imagePlaceholder: { width: 90, height: 90, backgroundColor: '#000', borderRadius: 8 },
  accuracyText: { color: 'white', fontSize: 16, marginBottom: 30 },
  submitButton: { backgroundColor: '#000', width: '90%', paddingVertical: 15, borderRadius: 6, alignItems: 'center' },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  image: { width: 90, height: 90, borderRadius: 8 },
});
