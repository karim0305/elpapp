import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need react-native-vector-icons installed

const Setting = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [towerId, setTowerId] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [lpCode, setLpCode] = useState('');
  const [serverHost, setServerHost] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [checkReg, setCheckReg] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const millJson = await AsyncStorage.getItem('millInfo');
        const elpJson = await AsyncStorage.getItem('elpInfo');
        if (millJson) {
          const mill = JSON.parse(millJson);
          setLatitude(mill.latitude ?? '');
          setLongitude(mill.longitude ?? '');
          setTowerId(mill.towerId ?? '');
          setServerHost(mill.serverHost ?? '');
          setAccuracy(mill.accuracy?.toString() ?? '');
          setCheckReg(mill.checkReg ? 'YES' : 'NO');
        }
        if (elpJson) {
          const elp = JSON.parse(elpJson);
          setCompanyCode(elp.companyCode ?? '');
          setLpCode(elp.lpCode ?? '');
        }
      } catch (e) {
        console.warn('Failed to load settings', e);
      }
    };
    loadSettings();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>LP</Text>

      <TouchableOpacity style={styles.buttonSolid}>
        <Text style={styles.buttonSolidText}>REGISTRATION MODE</Text>
        <Icon name="refresh" size={22} color="#fff" style={styles.iconRight} />
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="map-marker" size={24} color="#ccc" />
        </View>
        <View style={styles.rowButtons}>
          <View style={styles.buttonOutlined}>
            <Text style={styles.buttonOutlinedText}>Lat: {latitude || 'N/A'}</Text>
          </View>
          <View style={styles.buttonOutlined}>
            <Text style={styles.buttonOutlinedText}>Long: {longitude || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="tower-cell" size={24} color="#ccc" />
        </View>
        <View style={[styles.buttonOutlined, { flex: 1 }]}>
          <Text style={styles.buttonOutlinedText}>Tower Id : {towerId || 'N/A'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonSolid}>
        <Text style={styles.buttonSolidText}>CHANGE PASSWORD</Text>
        <Icon name="lock" size={22} color="#fff" style={styles.iconRight} />
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="store" size={24} color="#ccc" />
        </View>
        <View style={[styles.buttonOutlined, { flex: 1 }]}>
          <Text style={styles.buttonOutlinedText}>Company Code : {companyCode || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="store" size={24} color="#ccc" />
        </View>
        <View style={[styles.buttonOutlined, { flex: 1 }]}>
          <Text style={styles.buttonOutlinedText}>LP Code : {lpCode || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="web" size={24} color="#ccc" />
        </View>
        <View style={[styles.buttonOutlined, { flex: 1 }]}>
          <Text style={styles.buttonOutlinedText}>Server Host : {serverHost || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="web" size={24} color="#ccc" />
        </View>
        <View style={[styles.buttonOutlined, { flex: 1 }]}>
          <Text style={styles.buttonOutlinedText}>Accuracy : {accuracy || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.rowLast}>
        <View style={styles.iconContainer}>
          <Icon name="truck-check" size={24} color="#ccc" />
        </View>
        <Text style={styles.checkRegText}>CHECK REG ON ARRIVAL : {checkReg || 'N/A'}</Text>
      </View>
    </ScrollView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c3c4c',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 24,
  },
  buttonSolid: {
    flexDirection: 'row',
    backgroundColor: '#0f2027',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  buttonSolidText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  iconRight: {
    position: 'absolute',
    right: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rowLast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  rowButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonOutlined: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 4,
  },
  buttonOutlinedText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
  checkRegText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
});
