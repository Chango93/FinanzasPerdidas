import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@fastshot/auth';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createProfile } from '@/services/database';

type ClassType = 'guerrero' | 'mago' | 'cazador';

interface ClassOption {
  id: ClassType;
  name: string;
  icon: string;
  description: string;
  stats: {
    health: string;
    energy: string;
    special: string;
  };
}

const CLASSES: ClassOption[] = [
  {
    id: 'guerrero',
    name: 'Guerrero',
    icon: '⚔️',
    description: 'Experto en combate directo contra deudas. Ataca con pagos constantes y disciplina.',
    stats: {
      health: '+10% Salud Financiera',
      energy: 'Energía estándar',
      special: 'Bonus contra Bosses de Deuda',
    },
  },
  {
    id: 'mago',
    name: 'Mago',
    icon: '🔮',
    description: 'Maestro de la previsión y estrategia. Usa hechizos para multiplicar tus ahorros.',
    stats: {
      health: 'Salud estándar',
      energy: '+15% Energía de Ahorro',
      special: 'Bonus en Misiones de Ahorro',
    },
  },
  {
    id: 'cazador',
    name: 'Cazador',
    icon: '🎯',
    description: 'Rastreador de gastos innecesarios. Experto en completar misiones y lograr metas.',
    stats: {
      health: 'Salud estándar',
      energy: 'Energía estándar',
      special: '+25% XP en todas las Misiones',
    },
  },
];

export default function ClassSelectionScreen() {
  const insets = useSafeAreaInsets();
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const handleSelectClass = (classId: ClassType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedClass(classId);
  };

  const handleConfirm = async () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Por favor selecciona una clase');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'No se encontró usuario autenticado');
      return;
    }

    setIsCreating(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      // Generate username from email
      const generatedUsername = user.email?.split('@')[0] || `usuario_${Date.now()}`;

      // Create profile in database
      const profile = await createProfile(user.id, generatedUsername, selectedClass);

      if (!profile) {
        throw new Error('Error al crear perfil');
      }

      Alert.alert(
        '¡Bienvenido a Finverge! 🎮',
        `Has elegido la clase ${CLASSES.find((c) => c.id === selectedClass)?.name}. ¡Prepárate para transformar tus finanzas!`,
        [
          {
            text: 'Comenzar',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert(
        'Error',
        'Hubo un problema al crear tu perfil. Por favor intenta de nuevo.'
      );
      setIsCreating(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Elige tu Clase</Text>
          <Text style={styles.subtitle}>
            Cada clase tiene habilidades únicas que te ayudarán en tu viaje financiero
          </Text>
        </View>

        {/* Class Options */}
        <View style={styles.classesContainer}>
          {CLASSES.map((classOption) => (
            <Pressable
              key={classOption.id}
              onPress={() => handleSelectClass(classOption.id)}
              style={({ pressed }) => [
                styles.classCard,
                selectedClass === classOption.id && styles.classCardSelected,
                pressed && styles.classCardPressed,
              ]}
            >
              <LinearGradient
                colors={
                  selectedClass === classOption.id
                    ? [Colors.neonGreen + '30', Colors.neonGreen + '10']
                    : [Colors.surface, Colors.surfaceLight]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.classCardGradient}
              >
                {/* Icon and Name */}
                <View style={styles.classHeader}>
                  <Text style={styles.classIcon}>{classOption.icon}</Text>
                  <Text style={styles.className}>{classOption.name}</Text>
                  {selectedClass === classOption.id && (
                    <Text style={styles.selectedBadge}>✓</Text>
                  )}
                </View>

                {/* Description */}
                <Text style={styles.classDescription}>{classOption.description}</Text>

                {/* Stats */}
                <View style={styles.statsContainer}>
                  <Text style={styles.statLabel}>Habilidades:</Text>
                  <Text style={styles.statText}>• {classOption.stats.health}</Text>
                  <Text style={styles.statText}>• {classOption.stats.energy}</Text>
                  <Text style={styles.statText}>• {classOption.stats.special}</Text>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* Confirm Button */}
        <Pressable
          onPress={handleConfirm}
          disabled={!selectedClass || isCreating}
          style={({ pressed }) => [
            styles.confirmButton,
            (!selectedClass || isCreating) && styles.confirmButtonDisabled,
            pressed && styles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={!selectedClass || isCreating ? [Colors.border, Colors.border] : Colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.confirmButtonGradient}
          >
            <Text style={styles.confirmButtonText}>
              {isCreating ? 'Creando...' : selectedClass ? 'Confirmar Clase' : 'Selecciona una Clase'}
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.extrabold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  classesContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  classCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  classCardSelected: {
    borderColor: Colors.neonGreen,
  },
  classCardPressed: {
    opacity: 0.8,
  },
  classCardGradient: {
    padding: Spacing.md,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  classIcon: {
    fontSize: 40,
    marginRight: Spacing.sm,
  },
  className: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    flex: 1,
  },
  selectedBadge: {
    fontSize: 24,
    color: Colors.neonGreen,
  },
  classDescription: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  statsContainer: {
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  statLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  statText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  confirmButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  confirmButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.background,
  },
});
