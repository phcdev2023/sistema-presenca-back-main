import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function FagammonLogo({ size = 80 }: { size?: number }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/fagammon-logo.png')}
        style={{ width: size, height: size, resizeMode: 'contain' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
