import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AttendanceHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Presença</Text>
      <Text style={styles.desc}>Aqui serão exibidas as presenças registradas em eventos.</Text>
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
    textAlign: 'center',
  },
});
