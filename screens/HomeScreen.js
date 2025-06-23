import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EventCard from '../components/EventCard';
import CustomButton from '../components/CustomButton';

const events = [
  { id: 1, title: 'Aula de Matemática', date: '18/06/2025 - 08:00' },
  { id: 2, title: 'Palestra de Carreira', date: '19/06/2025 - 14:00' },
  { id: 3, title: 'Reunião de Grupo', date: '20/06/2025 - 10:00' },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Eventos Recentes</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {events.map(event => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            onPress={() => {/* futuro: detalhes do evento */}}
          />
        ))}
        <CustomButton
          title="Marcar Presença Agora"
          onPress={() => navigation.navigate('QRCode')}
          style={styles.button}
        />
        <CustomButton
          title="Sair"
          onPress={() => navigation.replace('Login')}
          style={[styles.button, { backgroundColor: '#e74c3c' }]}
          textStyle={{ color: '#fff' }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8fff1',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e9d4c',
    marginLeft: 20,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },
  button: {
    marginTop: 18,
  },
});
