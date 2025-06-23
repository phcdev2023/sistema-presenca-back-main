import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import FagammonLogo from '../components/FagammonLogo';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === 'usuario@teste.com' && password === '123456') {
        navigation.replace('Main');
      } else {
        Alert.alert('Erro', 'Usuário ou senha inválidos!\nUse usuario@teste.com / 123456');
      }
    }, 800);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <FagammonLogo size={90} />
        <Text style={styles.title}>Entrar no Sistema</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Não tem conta? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Cadastre-se</Text></Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Usuário teste: usuario@teste.com{"\n"}Senha: 123456</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 28,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 350,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginBottom: 14,
    backgroundColor: colors.secondary,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  link: {
    color: colors.muted,
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  hint: {
    marginTop: 22,
    color: colors.accent,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.8,
  },
});
