import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthProvider } from '@fastshot/auth';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AuthProvider
      supabaseClient={supabase}
      routes={{
        login: '/(auth)/login',
        afterLogin: '/(tabs)',
      }}
    >
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="expense-logger"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="boss-detail"
            options={{
              presentation: 'card',
            }}
          />
        </Stack>
      </View>
    </AuthProvider>
  );
}
