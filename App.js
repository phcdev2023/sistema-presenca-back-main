import * as React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 28, color: '#0e9d4c', fontWeight: 'bold' }}>Teste mínimo funcionando</Text>
      <Text style={{ fontSize: 16, color: '#333', marginTop: 20 }}>Se você vê este texto, o problema está nos imports ou componentes.</Text>
    </View>
  );
}

  return (
    <Tab.Navigator
      initialRouteName="QRCode"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0e9d4c',
        tabBarInactiveTintColor: '#7be495',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, height: 60 },
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 13, marginBottom: 4 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'QRCode') iconName = 'qrcode-scan';
          else if (route.name === 'Home') iconName = 'calendar-multiselect';
          else if (route.name === 'Profile') iconName = 'account-circle';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="QRCode" component={QRCodeScreen} options={{ title: 'Marcar Presença' }} />
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Eventos' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );


import { Platform, View, Text } from 'react-native';

export default function App() {
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8fff1' }}>
        <Text style={{ fontSize: 28, color: '#e74c3c', marginTop: 22, textAlign: 'center', fontWeight: 'bold' }}>
          Este app não funciona no navegador
        </Text>
        <Text style={{ fontSize: 18, color: '#0e9d4c', marginTop: 14, textAlign: 'center', maxWidth: 320 }}>
          Por usar recursos nativos (câmera, QR Code, etc), acesse pelo app Expo Go no seu celular.
        </Text>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: true, title: 'Escanear QR Code', headerStyle: { backgroundColor: '#0e9d4c' }, headerTintColor: '#fff' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
