import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function QRCodeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marcar Presença</Text>
      <TouchableOpacity style={styles.qrButton} onPress={() => navigation.navigate('Camera')}>
        <Icon name="qrcode-scan" size={90} color="#0e9d4c" />
        <Text style={styles.qrText}>Clique para escanear QR Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8fff1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0e9d4c',
    marginBottom: 30,
  },
  qrButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  qrText: {
    color: '#0e9d4c',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 12,
  },
});
