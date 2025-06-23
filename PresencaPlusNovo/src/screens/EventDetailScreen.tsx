import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function EventDetailScreen({ navigation, route }: any) {
  const { event } = route.params || { event: { title: 'Evento Exemplo', description: 'Descrição do evento.' } };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.desc}>{event.description}</Text>
      <Button title="Registrar Presença" onPress={() => navigation.navigate('Attendance', { event })} />
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
