import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CustomInput({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, error, ...props }) {
  return (
    <View style={styles.container}>
      {icon && <Icon name={icon} size={22} color="#0e9d4c" style={styles.icon} />}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor="#7be495"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 18,
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: 16,
    zIndex: 2,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingLeft: 44,
    fontSize: 16,
    color: '#0e9d4c',
    borderWidth: 1,
    borderColor: '#e8fff1',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 6,
  },
});
