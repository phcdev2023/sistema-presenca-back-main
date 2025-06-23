import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const user = {
  name: 'João da Silva',
  email: 'joao.silva@email.com',
};

export default function ProfileScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarBox}>
        <Image
          source={{ uri: 'https://ui-avatars.com/api/?name=Joao+Silva&background=4CAF50&color=fff&size=128' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AttendanceHistory')}>
        <Ionicons name="calendar" size={22} color={colors.primary} style={{ marginRight: 12 }} />
        <Text style={styles.buttonText}>Histórico de Presença</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="settings" size={22} color={colors.primary} style={{ marginRight: 12 }} />
        <Text style={styles.buttonText}>Configurações</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.error || '#e53935' }]} onPress={() => navigation.replace('Login')}>
        <Ionicons name="log-out-outline" size={22} color={colors.secondary} style={{ marginRight: 12 }} />
        <Text style={[styles.buttonText, { color: colors.secondary }]}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 18,
  },
  avatarBox: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  email: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginBottom: 14,
    width: 320,
    elevation: 1,
  },
  buttonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
