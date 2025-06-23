import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen() {
  // Dados fictícios para exibição
  const user = {
    name: 'João da Silva',
    email: 'joao@email.com',
    role: 'Aluno',
    registration: '2021001234',
    course: 'BSI',
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Icon name="account-circle" size={100} color="#0e9d4c" />
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.info}>{user.email}</Text>
      <Text style={styles.info}>Cargo: {user.role}</Text>
      <Text style={styles.info}>Matrícula: {user.registration}</Text>
      <Text style={styles.info}>Curso: {user.course}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8fff1',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatarContainer: {
    backgroundColor: '#fff',
    borderRadius: 60,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0e9d4c',
    marginBottom: 8,
  },
  info: {
    fontSize: 18,
    color: '#0e9d4c',
    marginBottom: 6,
  },
});
