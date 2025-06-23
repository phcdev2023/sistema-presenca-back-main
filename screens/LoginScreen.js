import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Simulação de validação
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    setError('');
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor="#e8fff1" barStyle="dark-content" />
      <View style={styles.logoContainer}>
        <Icon name="account-circle" size={90} color="#0e9d4c" />
        <Text style={styles.appName}>Presença Plus</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>Entrar</Text>
        <CustomInput
          icon="email"
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          error={error && !email ? error : ''}
        />
        <CustomInput
          icon="lock"
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={error && !password ? error : ''}
        />
        <CustomButton title="Entrar" onPress={handleLogin} />
        <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          Não tem conta? Cadastrar-se
        </Text>
        {error && email && password ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8fff1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0e9d4c',
    marginTop: 6,
    letterSpacing: 1,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e9d4c',
    marginBottom: 18,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#e8fff1',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    color: '#0e9d4c',
  },
  loginButton: {
    backgroundColor: '#0e9d4c',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  registerLink: {
    color: '#0e9d4c',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: '#d32f2f',
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center',
  },
});
