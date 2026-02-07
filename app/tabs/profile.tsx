import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@fastshot/auth';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon, Circle, Line } from 'react-native-svg';
import { getAICoachTip } from '@/services/aiCoach';
import { useUserData } from '@/hooks/useUserData';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { profile, skills, isLoading } = useUserData();

  const user = {
    username: profile?.username || 'Jugador',
    class: profile?.selected_class === 'guerrero' ? '⚔️ Guerrero' : profile?.selected_class === 'mago' ? '🔮 Mago' : '🎯 Cazador',
    level: profile?.level || 1,
    xp: profile?.xp || 0,
    maxXp: profile?.max_xp || 100,
    streak: profile?.streak_days || 0,
  };

  const radarStats = {
    consistencyScore: skills?.constancia || 50,
    savingScore: skills?.ahorro || 50,
    controlScore: skills?.control || 50,
    forecastingScore: skills?.prevision || 50,
  };

  const [achievements] = useState([
    { id: '1', icon: '🏆', name: 'Primer Ahorro', date: 'Hace 7 días' },
    { id: '2', icon: '📅', name: 'Racha de 7 Días', date: 'Hace 5 días' },
    { id: '3', icon: '👹', name: 'Boss Derrotado', date: 'Hace 2 días' },
  ]);

  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  const loadAITip = useCallback(async () => {
    setIsLoadingTip(true);
    try {
      const tip = await getAICoachTip({
        weeklySpending: 2500,
        topCategories: [
          { category: 'Comida', amount: 800, frequency: 12 },
          { category: 'Transporte', amount: 600, frequency: 8 },
        ],
        currentStreak: user.streak,
        level: user.level,
        activeBosses: [{ name: 'Tarjeta de Crédito', progress: 40 }],
        savingsProgress: 60,
      });
      setAiTip(tip);
    } catch (error) {
      console.error('Failed to load AI tip:', error);
      setAiTip('Eso, mi buen, sigue así. Un día a la vez 💪');
    } finally {
      setIsLoadingTip(false);
    }
  }, [user.streak, user.level]);

  useEffect(() => {
    loadAITip();
  }, [loadAITip]);

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir de Finverge?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await signOut();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.neonGreen} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tu Progreso</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>🎮</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userClass}>{user.class}</Text>
            <View style={styles.userLevel}>
              <Text style={styles.userLevelText}>Nivel {user.level}</Text>
              <Text style={styles.userXP}>
                {user.xp.toLocaleString()} / {user.maxXp.toLocaleString()} XP
              </Text>
            </View>
          </View>
        </View>

        {/* Radar Chart */}
        <View style={styles.radarSection}>
          <Text style={styles.sectionTitle}>Habilidades Financieras</Text>
          <RadarChart stats={radarStats} />
        </View>

        {/* AI Coach Tip */}
        <Pressable
          style={styles.aiCoachCard}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            loadAITip();
          }}
        >
          <View style={styles.aiCoachHeader}>
            <Text style={styles.aiCoachIcon}>🤖</Text>
            <View style={styles.aiCoachInfo}>
              <Text style={styles.aiCoachTitle}>Newell AI Coach</Text>
              <Text style={styles.aiCoachSubtitle}>
                {isLoadingTip ? 'Generando consejo...' : 'Toca para nuevo consejo'}
              </Text>
            </View>
          </View>
          {isLoadingTip ? (
            <View style={styles.aiCoachLoading}>
              <ActivityIndicator color={Colors.cyanBlue} />
              <Text style={styles.aiCoachLoadingText}>Analizando tus finanzas...</Text>
            </View>
          ) : (
            <Text style={styles.aiCoachMessage}>
              {aiTip || 'Eso, mi buen, sigue así. Un día a la vez 💪'}
            </Text>
          )}
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>Powered by Newell AI</Text>
          </View>
        </Pressable>

        {/* Recent Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Logros Recientes</Text>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>{achievement.name}</Text>
                <Text style={styles.achievementDate}>{achievement.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Premium Upgrade */}
        <Pressable
          style={styles.premiumCard}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <LinearGradient
            colors={Colors.gradient.purple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumCardGradient}
          >
            <Text style={styles.premiumIcon}>👑</Text>
            <Text style={styles.premiumTitle}>Premium (Finverge Gold)</Text>
            <Text style={styles.premiumDescription}>
              • AI Coaching personalizado{'\n'}
              • Skins exclusivos (Neon, Cyberpunk, E-Ink){'\n'}
              • Múltiples Bosses simultáneos{'\n'}
              • Estadísticas avanzadas
            </Text>
            <View style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Desbloquear</Text>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Sign Out Button */}
        <Pressable
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>🚪 Cerrar Sesión</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

interface RadarChartProps {
  stats: {
    consistencyScore: number;
    savingScore: number;
    controlScore: number;
    forecastingScore: number;
  };
}

function RadarChart({ stats }: RadarChartProps) {
  const size = 280;
  const center = size / 2;
  const radius = size / 2 - 40;

  const labels = [
    { key: 'consistencyScore', label: 'Consistencia', angle: -90 },
    { key: 'savingScore', label: 'Ahorro', angle: 30 },
    { key: 'controlScore', label: 'Control', angle: 150 },
    { key: 'forecastingScore', label: 'Previsión', angle: 270 },
  ];

  const getPoint = (value: number, angle: number) => {
    const radians = (angle * Math.PI) / 180;
    const distance = (value / 100) * radius;
    return {
      x: center + distance * Math.cos(radians),
      y: center + distance * Math.sin(radians),
    };
  };

  const points = labels.map((label) => {
    const value = stats[label.key as keyof typeof stats];
    return getPoint(value, label.angle);
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.radarContainer}>
      <Svg width={size} height={size}>
        {/* Background grid circles */}
        {[25, 50, 75, 100].map((percent) => (
          <Circle
            key={percent}
            cx={center}
            cy={center}
            r={(percent / 100) * radius}
            stroke={Colors.border}
            strokeWidth="1"
            fill="none"
          />
        ))}

        {/* Axis lines */}
        {labels.map((label) => {
          const endPoint = getPoint(100, label.angle);
          return (
            <Line
              key={label.key}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke={Colors.border}
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <Polygon
          points={polygonPoints}
          fill={Colors.neonGreen}
          fillOpacity={0.3}
          stroke={Colors.neonGreen}
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="4" fill={Colors.neonGreen} />
        ))}
      </Svg>

      {/* Labels */}
      {labels.map((label, index) => {
        const value = stats[label.key as keyof typeof stats];
        const labelPoint = getPoint(105, label.angle);
        return (
          <View
            key={label.key}
            style={[
              styles.radarLabel,
              {
                position: 'absolute',
                left: labelPoint.x - 40,
                top: labelPoint.y - 20,
              },
            ]}
          >
            <Text style={styles.radarLabelText}>{label.label}</Text>
            <Text style={styles.radarLabelValue}>{value}%</Text>
          </View>
        );
      })}
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
  userCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  userAvatarText: {
    fontSize: 48,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
  },
  userClass: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  userLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  userLevelText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold as any,
    color: Colors.neonGreen,
  },
  userXP: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  radarSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  radarContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  radarLabel: {
    alignItems: 'center',
    width: 80,
  },
  radarLabelText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  radarLabelValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold as any,
    color: Colors.neonGreen,
  },
  aiCoachCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.cyanBlue,
    marginBottom: Spacing.lg,
  },
  aiCoachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  aiCoachIcon: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  aiCoachInfo: {
    flex: 1,
  },
  aiCoachTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold as any,
    color: Colors.textPrimary,
  },
  aiCoachSubtitle: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  aiCoachMessage: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  aiCoachLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  aiCoachLoadingText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.cyanBlue,
  },
  premiumBadgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold as any,
    color: Colors.cyanBlue,
  },
  achievementsSection: {
    marginBottom: Spacing.lg,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold as any,
    color: Colors.textPrimary,
  },
  achievementDate: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  premiumCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  premiumCardGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  premiumTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  premiumDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  premiumButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold as any,
    color: Colors.electricPurple,
  },
  signOutButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.crimsonRed,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  signOutText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold as any,
    color: Colors.crimsonRed,
  },
});
