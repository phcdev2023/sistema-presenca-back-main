import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function BottomNavBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.secondary,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 62,
          paddingBottom: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Início') {
            return <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />;
          }
          if (route.name === 'Presença') {
            return <MaterialCommunityIcons name={focused ? 'qrcode-scan' : 'qrcode'} size={size} color={color} />;
          }
          if (route.name === 'Notificações') {
            return <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={size} color={color} />;
          }
          if (route.name === 'Perfil') {
            return <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={size} color={color} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Presença" component={() => <Text>funcionando</Text>} />
      <Tab.Screen name="Notificações" component={() => <Text>funcionando</Text>} />
      <Tab.Screen name="Perfil" component={() => <Text>funcionando</Text>} />
    </Tab.Navigator>
  );
}
