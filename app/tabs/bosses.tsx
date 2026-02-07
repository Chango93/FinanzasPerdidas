import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@fastshot/auth';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBosses } from '@/services/database';
import type { Boss } from '@/types/database';

export default function BossesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBosses = async () => {
    if (!user) return;

    setIsLoading(true);
    const data = await getBosses(user.id);
    setBosses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBosses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleBossPress = (bossId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/boss-detail',
      params: { id: bossId },
    });
  };

  const activeBosses = bosses.filter((b) => !b.is_defeated);
  const defeatedBosses = bosses.filter((b) => b.is_defeated);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.neonGreen} />
        <Text style={styles.loadingText}>Cargando bosses...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boss Battle</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Active Bosses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚔️ Batallas Activas</Text>
          {activeBosses.length === 0 ? (
            <Text style={styles.emptyText}>No hay bosses activos</Text>
          ) : (
            activeBosses.map((boss) => (
              <BossCard key={boss.id} boss={boss} onPress={() => handleBossPress(boss.id)} />
            ))
          )}
        </View>

        {/* Defeated Bosses (Trophies) */}
        {defeatedBosses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Trofeos</Text>
            {defeatedBosses.map((boss) => (
              <BossCard
                key={boss.id}
                boss={boss}
                onPress={() => handleBossPress(boss.id)}
                defeated
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

interface BossCardProps {
  boss: Boss;
  onPress: () => void;
  defeated?: boolean;
}

function BossCard({ boss, onPress, defeated }: BossCardProps) {
  const hpPercent = (boss.hp_remaining / boss.hp_total) * 100;
  const bossColor = boss.boss_type === 'debt' ? Colors.electricPurple : Colors.cyanBlue;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.bossCard,
        pressed && styles.bossCardPressed,
        defeated && styles.bossCardDefeated,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={defeated ? [Colors.surface, Colors.surface] : [Colors.surface, Colors.surfaceLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bossCardGradient}
      >
        {/* Boss Icon */}
        <View style={styles.bossIconContainer}>
          <Text style={styles.bossIcon}>
            {defeated ? '🏆' : boss.boss_type === 'debt' ? '👹' : '🎯'}
          </Text>
        </View>

        {/* Boss Info */}
        <View style={styles.bossInfo}>
          <View style={styles.bossHeader}>
            <Text style={styles.bossName}>{boss.name}</Text>
            {defeated && <Text style={styles.defeatedBadge}>✓ DERROTADO</Text>}
          </View>

          <View style={[styles.bossTypeBadge, { borderColor: bossColor }]}>
            <Text style={[styles.bossTypeText, { color: bossColor }]}>
              Boss: {boss.boss_type === 'debt' ? 'Deuda' : 'Meta'}
            </Text>
          </View>

          {/* HP Bar */}
          <View style={styles.hpContainer}>
            <View style={styles.hpBar}>
              <LinearGradient
                colors={defeated ? [Colors.neonGreen, Colors.neonGreen] : [Colors.crimsonRed, Colors.electricPurple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.hpBarFill, { width: `${defeated ? 100 : hpPercent}%` }]}
              />
            </View>
            <Text style={styles.hpText}>
              HP: ${boss.hp_remaining.toLocaleString()} / ${boss.hp_total.toLocaleString()}
            </Text>
          </View>

          {/* Recent Attack */}
          {!defeated && (
            <View style={styles.recentAttack}>
              <Text style={styles.recentAttackLabel}>Ataque Reciente:</Text>
              <Text style={styles.recentAttackValue}>Pago de $2,500 (-2,500 HP)</Text>
            </View>
          )}

          {/* Trophy Info */}
          {defeated && boss.trophy_name && (
            <View style={styles.trophyInfo}>
              <Text style={styles.trophyLabel}>🏆 Trofeo:</Text>
              <Text style={styles.trophyName}>&ldquo;{boss.trophy_name}&rdquo;</Text>
              <Text style={styles.trophyXP}>+500 XP</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.extrabold as any,
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.base,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  bossCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bossCardPressed: {
    opacity: 0.8,
  },
  bossCardDefeated: {
    borderColor: Colors.neonGreen,
  },
  bossCardGradient: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  bossIconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  bossIcon: {
    fontSize: 60,
  },
  bossInfo: {
    flex: 1,
  },
  bossHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  bossName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
  },
  defeatedBadge: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold as any,
    color: Colors.neonGreen,
  },
  bossTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  bossTypeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold as any,
  },
  hpContainer: {
    marginBottom: Spacing.sm,
  },
  hpBar: {
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  hpBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  hpText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  recentAttack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  recentAttackLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  recentAttackValue: {
    fontSize: Typography.xs,
    color: Colors.crimsonRed,
    fontWeight: Typography.semibold as any,
  },
  trophyInfo: {
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  trophyLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  trophyName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold as any,
    color: Colors.neonGreen,
    marginBottom: Spacing.xs,
  },
  trophyXP: {
    fontSize: Typography.sm,
    color: Colors.neonGreen,
    fontWeight: Typography.bold as any,
  },
});
