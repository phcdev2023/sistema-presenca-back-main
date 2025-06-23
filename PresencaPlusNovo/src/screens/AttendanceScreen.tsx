import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const mockHistory = [
  { id: '1', date: '2025-06-23', time: '19:00', event: 'Aula Magna' },
  { id: '2', date: '2025-06-20', time: '20:00', event: 'Palestra de Carreiras' },
  { id: '3', date: '2025-06-18', time: '18:30', event: 'Workshop React Native' },
];

export default function AttendanceScreen() {
  const [presentToday, setPresentToday] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registrar Presença</Text>
      <View style={styles.statusBox}>
        <Ionicons name={presentToday ? 'checkmark-circle' : 'close-circle'} size={32} color={presentToday ? colors.primary : '#ccc'} />
        <Text style={[styles.statusText, { color: presentToday ? colors.primary : '#888' }]}> 
          {presentToday ? 'Presença registrada hoje!' : 'Você ainda não registrou presença hoje.'}
        </Text>
      </View>
      <TouchableOpacity style={styles.qrButton} onPress={() => setPresentToday(true)}>
        <Ionicons name="qr-code" size={40} color={colors.secondary} />
        <Text style={styles.qrText}>Registrar presença</Text>
      </TouchableOpacity>
      <Text style={styles.historyTitle}>Últimas presenças</Text>
      <FlatList
        data={mockHistory}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Ionicons name="calendar" size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.historyText}>{item.date} às {item.time} - {item.event}</Text>
          </View>
        )}
        style={{ marginTop: 8 }}
      />
      <Text style={styles.tip}>Dica: aproxime-se do local do evento para registrar presença.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
    elevation: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginBottom: 22,
    marginTop: 6,
    elevation: 2,
  },
  qrText: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: 'bold',
    marginLeft: 14,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
    marginBottom: 6,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    width: 320,
  },
  historyText: {
    fontSize: 15,
    color: colors.text,
  },
  tip: {
    marginTop: 18,
    color: colors.muted,
    fontSize: 15,
    fontStyle: 'italic',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
});
