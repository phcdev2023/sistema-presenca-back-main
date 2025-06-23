import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
// Aqui você integraria o expo-location

export default function LocationValidationScreen({ navigation, route }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validação de Localização</Text>
      <Text style={styles.desc}>Confirme sua presença validando a localização.</Text>
      {/* Aqui entraria o componente do expo-location */}
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
