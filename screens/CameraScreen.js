import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Só importa o BarCodeScanner se não for web
const isWeb = Platform.OS === 'web';
const BarCodeScanner = !isWeb ? require('expo-barcode-scanner').BarCodeScanner : null;

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Se for web, mostra mensagem amigável
  if (isWeb) {
    return (
      <View style={styles.center}>
        <Icon name="alert-circle" size={60} color="#e74c3c" />
        <Text style={{ fontSize: 22, color: '#e74c3c', marginTop: 16, textAlign: 'center' }}>
          O scanner de QR Code não está disponível no navegador.
        </Text>
        <Text style={{ fontSize: 15, color: '#0e9d4c', marginTop: 10, textAlign: 'center' }}>
          Acesse este recurso pelo app Expo Go no seu celular.
        </Text>
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Aqui você pode chamar a API para registrar a presença
    alert(`Presença registrada! Código: ${data}`);
    navigation.goBack();
  };

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Solicitando permissão da câmera...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.center}><Text>Permissão da câmera negada.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
          <Icon name="refresh" size={28} color="#fff" />
          <Text style={styles.buttonText}>Escanear novamente</Text>
        </TouchableOpacity>
      )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8fff1',
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    marginHorizontal: 40,
    backgroundColor: '#0e9d4c',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});
