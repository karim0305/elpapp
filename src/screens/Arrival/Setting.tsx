import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // You need react-native-vector-icons installed

const Setting = () => {
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
            <Text style={styles.buttonOutlinedText}>Lat: 24.67435</Text>
          </View>
          <View style={styles.buttonOutlined}>
            <Text style={styles.buttonOutlinedText}>Long: 67.67435</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="tower-cell" size={24} color="#ccc" />
        </View>
        <View style={[styles.buttonOutlined, { flex: 1 }]}>
          <Text style={styles.buttonOutlinedText}>Tower Id : 35181</Text>
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
          <Text style={styles.buttonOutlinedText}>Company Code : 01</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="store" size={24} color="#ccc" />
        </View>
        <View style={[styles.buttonOutlined, { flex: 1 }]}>
          <Text style={styles.buttonOutlinedText}>LP Code : 1091</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="web" size={24} color="#ccc" />
        </View>
        <View style={[styles.buttonOutlined, { flex: 1 }]}>
          <Text style={styles.buttonOutlinedText}>Server Host : chaudhry.ecloud12.com</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Icon name="web" size={24} color="#ccc" />
        </View>
        <View style={[styles.buttonOutlined, { flex: 1 }]}>
          <Text style={styles.buttonOutlinedText}>Accuracy : 100</Text>
        </View>
      </View>

      <View style={styles.rowLast}>
        <View style={styles.iconContainer}>
          <Icon name="truck-check" size={24} color="#ccc" />
        </View>
        <Text style={styles.checkRegText}>CHECK REG ON ARRIVAL : YES</Text>
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
