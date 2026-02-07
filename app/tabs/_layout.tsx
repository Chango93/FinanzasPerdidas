import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom Tab Bar Icons (we'll use emojis for now, can be replaced with custom icons)
function TabBarIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: focused ? Colors.surfaceLight : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: focused ? 1 : 0,
        borderColor: Colors.neonGreen,
      }}
    >
      <Text style={{ fontSize: 24 }}>{icon}</Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.neonGreen,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: insets.bottom,
          height: 70 + insets.bottom,
          paddingTop: Spacing.sm,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Misiones',
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon="🎯" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bosses"
        options={{
          title: 'Bosses',
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon="👹" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => <TabBarIcon icon="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
