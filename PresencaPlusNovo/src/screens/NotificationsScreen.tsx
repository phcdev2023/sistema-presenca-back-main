import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const notifications = [
  { id: '1', title: 'Evento confirmado', desc: 'Sua inscrição na Aula Magna foi confirmada.', isNew: true },
  { id: '2', title: 'Presença registrada', desc: 'Você registrou presença na Palestra de Carreiras.', isNew: false },
  { id: '3', title: 'Novo evento disponível', desc: 'Workshop React Native aberto para inscrições!', isNew: true },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma notificação.</Text>}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Ionicons name={item.isNew ? 'notifications' : 'notifications-outline'} size={28} color={item.isNew ? colors.primary : colors.muted} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationDesc}>{item.desc}</Text>
            </View>
            {item.isNew && <View style={styles.badge}><Text style={styles.badgeText}>Novo</Text></View>}
          </View>
        )}
        style={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 18,
    alignSelf: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  notificationDesc: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  badgeText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: 40,
    fontSize: 16,
  },
});
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
