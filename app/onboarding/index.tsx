import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius, GameConfig } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { UserClass } from '@/types';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [selectedClass, setSelectedClass] = useState<UserClass | null>(null);
  const [bossType, setBossType] = useState<'debt' | 'goal'>('debt');

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      router.replace('/(tabs)');
    }
  };

  const handleSelectClass = (classType: UserClass) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedClass(classType);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === step && styles.progressDotActive,
              index < step && styles.progressDotCompleted,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step 0: Class Selection */}
        {step === 0 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Elige tu Clase</Text>
            <Text style={styles.stepSubtitle}>
              Tu estilo define tus bonificaciones de XP
            </Text>

            <View style={styles.classGrid}>
              {GameConfig.classes.map((cls) => (
                <Pressable
                  key={cls.id}
                  style={[
                    styles.classCard,
                    selectedClass === cls.id && styles.classCardSelected,
                  ]}
                  onPress={() => handleSelectClass(cls.id as UserClass)}
                >
                  <Text style={styles.classIcon}>{cls.icon}</Text>
                  <Text style={styles.className}>{cls.name}</Text>
                  <Text style={styles.classDescription}>{cls.description}</Text>
                  <View style={styles.classBonusContainer}>
                    <Text style={styles.classBonus}>{cls.bonuses}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Step 1: Boss Definition */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Define tu Boss Principal</Text>
            <Text style={styles.stepSubtitle}>
              La deuda o meta más importante que enfrentarás
            </Text>

            <View style={styles.bossTypeContainer}>
              <Pressable
                style={[
                  styles.bossTypeButton,
                  bossType === 'debt' && styles.bossTypeButtonActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBossType('debt');
                }}
              >
                <Text style={styles.bossTypeIcon}>💳</Text>
                <Text style={styles.bossTypeText}>Deuda</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.bossTypeButton,
                  bossType === 'goal' && styles.bossTypeButtonActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBossType('goal');
                }}
              >
                <Text style={styles.bossTypeIcon}>🎯</Text>
                <Text style={styles.bossTypeText}>Meta</Text>
              </Pressable>
            </View>

            <Text style={styles.bossExamples}>
              Ejemplos: &ldquo;Tarjeta de Crédito&rdquo;, &ldquo;Préstamo Estudiantil&rdquo;, &ldquo;Casa Nueva&rdquo;, &ldquo;Fondo
              de Emergencia&rdquo;
            </Text>
          </View>
        )}

        {/* Step 2: Tutorial */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Bienvenido al HUD</Text>
            <Text style={styles.stepSubtitle}>
              Tu panel de control financiero está listo
            </Text>

            <View style={styles.tutorialContainer}>
              <View style={styles.tutorialItem}>
                <Text style={styles.tutorialIcon}>💚</Text>
                <View style={styles.tutorialText}>
                  <Text style={styles.tutorialTitle}>Salud Financiera</Text>
                  <Text style={styles.tutorialDescription}>
                    Tu presupuesto actual. Mantente en verde.
                  </Text>
                </View>
              </View>

              <View style={styles.tutorialItem}>
                <Text style={styles.tutorialIcon}>⚡</Text>
                <View style={styles.tutorialText}>
                  <Text style={styles.tutorialTitle}>Energía de Ahorro</Text>
                  <Text style={styles.tutorialDescription}>
                    Tu progreso hacia tus metas de ahorro.
                  </Text>
                </View>
              </View>

              <View style={styles.tutorialItem}>
                <Text style={styles.tutorialIcon}>⭐</Text>
                <View style={styles.tutorialText}>
                  <Text style={styles.tutorialTitle}>XP y Nivel</Text>
                  <Text style={styles.tutorialDescription}>
                    Gana +25 XP por cada gasto registrado.
                  </Text>
                </View>
              </View>

              <View style={styles.tutorialItem}>
                <Text style={styles.tutorialIcon}>🔥</Text>
                <View style={styles.tutorialText}>
                  <Text style={styles.tutorialTitle}>Racha</Text>
                  <Text style={styles.tutorialDescription}>
                    Días consecutivos registrando. +50% XP bonus.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Next Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          style={[
            styles.nextButton,
            (step === 0 && !selectedClass) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={step === 0 && !selectedClass}
        >
          <LinearGradient
            colors={
              step === 0 && !selectedClass
                ? [Colors.border, Colors.border]
                : Colors.gradient.primary
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {step === 2 ? 'Comenzar' : 'Siguiente'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  progressDot: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
  },
  progressDotActive: {
    backgroundColor: Colors.neonGreen,
  },
  progressDotCompleted: {
    backgroundColor: Colors.neonGreen,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  stepSubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  classGrid: {
    gap: Spacing.md,
  },
  classCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  classCardSelected: {
    borderColor: Colors.neonGreen,
    backgroundColor: Colors.surfaceLight,
  },
  classIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  className: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  classDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  classBonusContainer: {
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  classBonus: {
    fontSize: Typography.sm,
    color: Colors.neonGreen,
    fontWeight: Typography.semibold as any,
  },
  bossTypeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  bossTypeButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  bossTypeButtonActive: {
    borderColor: Colors.electricPurple,
    backgroundColor: Colors.surfaceLight,
  },
  bossTypeIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  bossTypeText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
  },
  bossExamples: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  tutorialContainer: {
    gap: Spacing.lg,
  },
  tutorialItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tutorialIcon: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  tutorialText: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  tutorialDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.background,
  },
});
