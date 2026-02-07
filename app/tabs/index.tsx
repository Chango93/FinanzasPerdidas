import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CircularProgress from '@/components/CircularProgress';
import { useUserData } from '@/hooks/useUserData';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { profile, stats, isLoading } = useUserData();

  // Use real data from database or fallback to defaults
  const level = profile?.level || 1;
  const xp = profile?.xp || 0;
  const maxXp = profile?.max_xp || 100;
  const streak = profile?.streak_days || 0;
  const healthPercent = stats?.health_percent || 50;
  const energyPercent = stats?.energy_percent || 50;

  const handleExpenseLogger = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/expense-logger');
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.neonGreen} />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Level and XP */}
        <View style={styles.header}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelIcon}>⭐</Text>
            <Text style={styles.levelText}>Nivel {level}</Text>
          </View>
          <View style={styles.xpBar}>
            <View style={styles.xpBarBackground}>
              <LinearGradient
                colors={Colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.xpBarFill, { width: `${(xp / maxXp) * 100}%` }]}
              />
            </View>
            <Text style={styles.xpText}>
              XP: {xp.toLocaleString()} / {maxXp.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Main HUD - Health and Energy Circles */}
        <View style={styles.hudContainer}>
          <View style={styles.circleContainer}>
            <CircularProgress
              percentage={healthPercent}
              color={Colors.health}
              label="Salud Financiera"
              size={160}
            />
            <CircularProgress
              percentage={energyPercent}
              color={Colors.energy}
              label="Energía de Ahorro"
              size={160}
            />
          </View>
        </View>

        {/* Expense Logger Button */}
        <Pressable
          onPress={handleExpenseLogger}
          style={({ pressed }) => [styles.logButton, pressed && styles.logButtonPressed]}
        >
          <LinearGradient
            colors={Colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logButtonGradient}
          >
            <Text style={styles.logButtonIcon}>📊</Text>
            <Text style={styles.logButtonText}>+ Registrar Gasto</Text>
          </LinearGradient>
        </Pressable>

        {/* Quick Nav Buttons */}
        <View style={styles.quickNav}>
          <Pressable
            style={styles.quickNavButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/missions');
            }}
          >
            <Text style={styles.quickNavText}>Misiones</Text>
          </Pressable>
          <Pressable
            style={styles.quickNavButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/bosses');
            }}
          >
            <Text style={styles.quickNavText}>Bosses</Text>
          </Pressable>
        </View>

        {/* Streak Counter */}
        <View style={styles.streakContainer}>
          <Text style={styles.streakLabel}>Racha Actual:</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakValue}>{streak} Días</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    marginBottom: Spacing.xl,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.neonGreen,
    marginBottom: Spacing.sm,
  },
  levelIcon: {
    fontSize: 20,
    marginRight: Spacing.xs,
  },
  levelText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.neonGreen,
  },
  xpBar: {
    width: '100%',
  },
  xpBarBackground: {
    width: '100%',
    height: 24,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: BorderRadius.md,
  },
  xpText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  hudContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: Spacing.md,
  },
  logButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  logButtonPressed: {
    opacity: 0.8,
  },
  logButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  logButtonIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  logButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.background,
  },
  quickNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  quickNavButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickNavText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  streakContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  streakIcon: {
    fontSize: 20,
    marginRight: Spacing.xs,
  },
  streakValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.warning,
  },
});
