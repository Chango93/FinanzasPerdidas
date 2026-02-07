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
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@fastshot/auth';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithGoogle, signInWithApple, signInWithEmail, isLoading, error } = useAuth();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu email y contraseña');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signInWithEmail(email, password);
  };

  const handleGoogleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signInWithGoogle();
  };

  const handleAppleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signInWithApple();
  };

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
          <Text style={styles.subtitle}>Modo Guerrero Financiero</Text>
        </View>

        {/* Cyberpunk Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>INICIAR SESIÓN</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* OAuth Buttons */}
        <View style={styles.oauthContainer}>
          <Pressable
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            style={({ pressed }) => [styles.oauthButton, pressed && styles.buttonPressed]}
          >
            <LinearGradient
              colors={[Colors.surfaceLight, Colors.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.oauthButtonGradient}
            >
              <Text style={styles.oauthIcon}>🔷</Text>
              <Text style={styles.oauthText}>Continuar con Google</Text>
            </LinearGradient>
          </Pressable>

          {Platform.OS === 'ios' && (
            <Pressable
              onPress={handleAppleSignIn}
              disabled={isLoading}
              style={({ pressed }) => [styles.oauthButton, pressed && styles.buttonPressed]}
            >
              <LinearGradient
                colors={[Colors.surfaceLight, Colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.oauthButtonGradient}
              >
                <Text style={styles.oauthIcon}>🍎</Text>
                <Text style={styles.oauthText}>Continuar con Apple</Text>
              </LinearGradient>
            </Pressable>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email Form */}
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
              placeholder="••••••••"
              placeholderTextColor={Colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              editable={!isLoading}
            />
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error.message}</Text>
            </View>
          )}

          {/* Login Button */}
          <Pressable
            onPress={handleEmailLogin}
            disabled={isLoading}
            style={({ pressed }) => [styles.loginButton, pressed && styles.buttonPressed]}
          >
            <LinearGradient
              colors={Colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Cargando...' : 'Entrar al Juego'}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Forgot Password Link */}
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          </Link>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>¿Nuevo en Finverge? </Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable>
              <Text style={styles.signupLink}>Crear Cuenta</Text>
            </Pressable>
          </Link>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎮 Transforma tus finanzas en un juego táctico
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
  oauthContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  oauthButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  oauthButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  oauthIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  oauthText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold as any,
    color: Colors.textPrimary,
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
  loginButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  loginButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold as any,
    color: Colors.background,
  },
  linkButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.xs,
  },
  linkText: {
    fontSize: Typography.sm,
    color: Colors.cyanBlue,
    textDecorationLine: 'underline',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  signupText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  signupLink: {
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
});
