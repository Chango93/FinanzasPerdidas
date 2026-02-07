import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { Colors } from '@/constants/theme';

export default function Index() {
  // TODO: Check if user has completed onboarding
  // For now, always redirect to onboarding
  const hasCompletedOnboarding = false;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      {hasCompletedOnboarding ? (
        <Redirect href="/(tabs)" />
      ) : (
        <Redirect href="/onboarding" />
      )}
    </View>
  );
}
