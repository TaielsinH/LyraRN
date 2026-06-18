import { Redirect, router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { loginWithEmail } from "../services/authService";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password) {
      setErrorMessage("Ingresa email y contrasena.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await loginWithEmail(email.trim(), password);

      router.replace("/");
    } catch (error) {
      console.log(error);
      setErrorMessage("No se pudo iniciar sesion. Revisa tus credenciales.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando sesion...</Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Lyra</Text>
        <Text style={styles.subtitle}>Inicia sesion para continuar</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor="#8A8F98"
              style={styles.input}
              value={email}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contrasena</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder="Tu contrasena"
              placeholderTextColor="#8A8F98"
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <Pressable
            disabled={loading}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.button,
              (pressed || loading) && styles.buttonPressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
