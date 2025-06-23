import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Logo = () => (
  <View style={styles.container}>
    <Image
      source={require('../../assets/images/icon.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
});

export default Logo;
