import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const roles = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Professor', value: 'professor' },
  { label: 'Aluno', value: 'aluno' },
];

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('aluno');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.form}>
        <Text style={styles.title}>Criar Conta</Text>
        <CustomInput
          icon="account"
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <CustomInput
          icon="email"
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <CustomInput
          icon="lock"
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.roleContainer}>
          {roles.map(r => (
            <CustomButton
              key={r.value}
              title={r.label}
              onPress={() => setRole(r.value)}
              style={[styles.roleButton, role === r.value && styles.roleSelected]}
              textStyle={[styles.roleText, role === r.value && styles.roleTextSelected]}
            />
          ))}
        </View>
        <CustomButton title="Cadastrar" style={styles.registerButton} />
        <Text style={styles.loginLink} onPress={() => navigation.goBack()}>
          Já tem conta? Entrar
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8fff1',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 18,
  },
  roleButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#e8fff1',
    borderRadius: 10,
    paddingVertical: 10,
  },
  roleSelected: {
    backgroundColor: '#0e9d4c',
  },
  roleText: {
    color: '#0e9d4c',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roleTextSelected: {
    color: '#fff',
  },
  registerButton: {
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0e9d4c',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#e8fff1',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  roleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e8fff1',
    marginHorizontal: 4,
  },
  roleSelected: {
    backgroundColor: '#0e9d4c',
  },
  roleText: {
    color: '#0e9d4c',
    fontWeight: 'bold',
  },
  roleTextSelected: {
    color: '#fff',
  },
  registerButton: {
    backgroundColor: '#0e9d4c',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginLink: {
    color: '#0e9d4c',
    marginTop: 16,
    textAlign: 'center',
  },
});
