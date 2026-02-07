import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@fastshot/auth';
import { Colors, Typography, Spacing, BorderRadius, GameConfig } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMissions, completeMission } from '@/services/database';
import type { Mission } from '@/types/database';

export default function MissionsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMissions = async () => {
    if (!user) return;

    setIsLoading(true);
    const data = await getMissions(user.id);
    setMissions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleCompleteMission = async (missionId: string) => {
    if (!user) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    const completed = await completeMission(missionId, user.id);

    if (completed) {
      Alert.alert(
        '¡Misión Completada! 🎯',
        `+${mission.xp_reward} XP. Eso es lo que quería ver, sigue así.`,
        [{ text: 'OK', onPress: fetchMissions }]
      );
    }
  };

  const activeMissions = missions.filter((m) => !m.is_completed);
  const completedMissions = missions.filter((m) => m.is_completed);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.neonGreen} />
        <Text style={styles.loadingText}>Cargando misiones...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Misiones</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Active Missions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Misiones Activas</Text>
          {activeMissions.length === 0 ? (
            <Text style={styles.emptyText}>No hay misiones activas</Text>
          ) : (
            activeMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} onComplete={handleCompleteMission} />
            ))
          )}
        </View>

        {/* Completed Missions */}
        {completedMissions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completadas Hoy</Text>
            {completedMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </View>
        )}

        {/* Rewards Info */}
        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsTitle}>💎 Recompensas</Text>
          <Text style={styles.rewardsText}>
            Diarias: +{GameConfig.xpForMission.daily} XP
          </Text>
          <Text style={styles.rewardsText}>
            Semanales: +{GameConfig.xpForMission.weekly} XP
          </Text>
          <Text style={styles.rewardsText}>
            Especiales: +{GameConfig.xpForMission.special} XP
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

interface MissionCardProps {
  mission: Mission;
  onComplete?: (id: string) => void;
}

function MissionCard({ mission, onComplete }: MissionCardProps) {
  const getTypeColor = (type: Mission['mission_type']) => {
    switch (type) {
      case 'daily':
        return Colors.neonGreen;
      case 'weekly':
        return Colors.electricPurple;
      case 'special':
        return Colors.cyanBlue;
      default:
        return Colors.textSecondary;
    }
  };

  const getTypeLabel = (type: Mission['mission_type']) => {
    switch (type) {
      case 'daily':
        return 'Diaria';
      case 'weekly':
        return 'Semanal';
      case 'special':
        return 'Especial';
      default:
        return type;
    }
  };

  const progressPercent = (mission.progress / mission.target) * 100;

  return (
    <View style={[styles.missionCard, mission.is_completed && styles.missionCardCompleted]}>
      <View style={styles.missionHeader}>
        <View style={[styles.missionTypeBadge, { borderColor: getTypeColor(mission.mission_type) }]}>
          <Text style={[styles.missionTypeText, { color: getTypeColor(mission.mission_type) }]}>
            {getTypeLabel(mission.mission_type)}
          </Text>
        </View>
        {mission.is_completed && <Text style={styles.completedCheck}>✓</Text>}
      </View>

      <Text style={styles.missionTitle}>{mission.title}</Text>
      <Text style={styles.missionDescription}>{mission.description}</Text>

      {/* Progress Bar */}
      {!mission.is_completed && mission.target > 1 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {mission.mission_type === 'weekly'
              ? `$${mission.progress.toLocaleString()} / $${mission.target.toLocaleString()}`
              : `${mission.progress} / ${mission.target}`}
          </Text>
        </View>
      )}

      {/* XP Reward */}
      <View style={styles.missionFooter}>
        <View style={styles.xpBadge}>
          <Text style={styles.xpBadgeText}>+{mission.xp_reward} XP</Text>
        </View>
      </View>
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
  missionCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  missionCardCompleted: {
    opacity: 0.6,
    borderColor: Colors.neonGreen,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  missionTypeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  missionTypeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold as any,
  },
  completedCheck: {
    fontSize: 24,
    color: Colors.neonGreen,
  },
  missionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  missionDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.electricPurple,
    borderRadius: BorderRadius.sm,
  },
  progressText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.neonGreen,
  },
  xpBadgeText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold as any,
    color: Colors.neonGreen,
  },
  rewardsContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rewardsTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  rewardsText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
});
