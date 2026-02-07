import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@fastshot/auth';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUpWithEmail, isLoading, pendingEmailVerification, error } = useAuth();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await signUpWithEmail(email, password);

    if (result.emailConfirmationRequired) {
      Alert.alert(
        '¡Cuenta Creada! 🎉',
        `Hemos enviado un enlace de verificación a ${result.email}. Por favor verifica tu email antes de iniciar sesión.`,
        [
          {
            text: 'Entendido',
            onPress: () => router.push('/(auth)/class-selection'),
          },
        ]
      );
    } else {
      // If no email confirmation required, go to class selection
      router.push('/(auth)/class-selection');
    }
  };

  if (pendingEmailVerification) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}>
        <View style={styles.verificationContainer}>
          <Text style={styles.verificationIcon}>📧</Text>
          <Text style={styles.verificationTitle}>Verifica tu Email</Text>
          <Text style={styles.verificationText}>
            Hemos enviado un enlace de verificación a tu correo electrónico.
          </Text>
          <Text style={styles.verificationText}>
            Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
          </Text>

          <Link href="/(auth)/login" asChild>
            <Pressable style={styles.backButton}>
              <LinearGradient
                colors={Colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.backButtonGradient}
              >
                <Text style={styles.backButtonText}>Ir a Inicio de Sesión</Text>
              </LinearGradient>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>⚔️ FINVERGE</Text>
          <Text style={styles.subtitle}>Modo Registro</Text>
        </View>

        {/* Cyberpunk Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>CREAR CUENTA</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor={Colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={Colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password-new"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              placeholderTextColor={Colors.textTertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="password-new"
              editable={!isLoading}
            />
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error.message}</Text>
            </View>
          )}

          {/* Sign Up Button */}
          <Pressable
            onPress={handleSignUp}
            disabled={isLoading}
            style={({ pressed }) => [styles.signupButton, pressed && styles.buttonPressed]}
          >
            <LinearGradient
              colors={Colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signupButtonGradient}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Creando...' : 'Comenzar Aventura'}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Terms */}
          <Text style={styles.termsText}>
            Al registrarte, aceptas transformar tus finanzas en un juego épico de estrategia
          </Text>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.loginLink}>Iniciar Sesión</Text>
            </Pressable>
          </Link>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎮 Modo Táctico RPG Financiero Activado
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  logo: {
    fontSize: 42,
    fontWeight: Typography.extrabold as any,
    color: Colors.neonGreen,
    marginBottom: Spacing.sm,
    textShadowColor: Colors.neonGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.semibold as any,
  },
  formContainer: {
    gap: Spacing.lg,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold as any,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  errorContainer: {
    backgroundColor: Colors.crimsonRed + '20',
    borderWidth: 1,
    borderColor: Colors.crimsonRed,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.crimsonRed,
  },
  signupButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  signupButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  signupButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.background,
  },
  termsText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  loginText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold as any,
    color: Colors.neonGreen,
  },
  footer: {
    marginTop: Spacing['2xl'],
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  verificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  verificationIcon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  verificationTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold as any,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  verificationText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  backButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.xl,
    width: '100%',
  },
  backButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold as any,
    color: Colors.background,
  },
});
