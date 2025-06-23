import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
// Aqui você integraria o expo-barcode-scanner

export default function QRScannerScreen({ navigation, route }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leitor de QR Code</Text>
      <Text style={styles.desc}>Aponte a câmera para o QR Code do evento.</Text>
      {/* Aqui entraria o componente do expo-barcode-scanner */}
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  desc: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
});
