import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
// Aqui você integraria o expo-camera

export default function FacialRecognitionScreen({ navigation, route }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reconhecimento Facial</Text>
      <Text style={styles.desc}>Tire uma foto para validar sua presença.</Text>
      {/* Aqui entraria o componente do expo-camera */}
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
