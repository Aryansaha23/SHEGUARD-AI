import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const USERS_KEY = "@sheguard_users";
const AUTH_KEY = "@sheguard_logged_in";
const CURRENT_USER_KEY = "@sheguard_current_user";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    // Clear previous errors
    setEmailError("");
    setPasswordError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    // -------------------------
    // BASIC VALIDATION
    // -------------------------

    if (!cleanEmail) {
      setEmailError("Please enter your email address.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!cleanPassword) {
      setPasswordError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // -------------------------
      // GET REGISTERED USERS
      // -------------------------

      const usersData = await AsyncStorage.getItem(USERS_KEY);

      const users = usersData ? JSON.parse(usersData) : [];

      // -------------------------
      // CHECK EMAIL
      // -------------------------

      const user = users.find(
        (item: any) =>
          item.email?.trim().toLowerCase() === cleanEmail
      );

      // Email is NOT registered
      if (!user) {
        setEmailError(
          "Account not found. Please register first."
        );
        setLoading(false);
        return;
      }

      // -------------------------
      // CHECK PASSWORD
      // -------------------------

      if (user.password !== cleanPassword) {
        setPasswordError(
          "Incorrect password. Please try again."
        );
        setLoading(false);
        return;
      }

      // -------------------------
      // LOGIN SUCCESS
      // -------------------------

      await AsyncStorage.setItem(AUTH_KEY, "true");

      await AsyncStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
      );

      // Go directly to Home
      router.replace("/home");

    } catch (error) {
      console.error("Login Error:", error);

      Alert.alert(
        "Login Error",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* LOGO */}
        <View style={styles.logoCircle}>
          <Ionicons
            name="shield-checkmark"
            size={42}
            color="#E91E63"
          />
        </View>

        <Text style={styles.appName}>
          SHEGUARD AI
        </Text>

        {/* HEADING */}
        <Text style={styles.title}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Login to continue to your safety assistant.
        </Text>

        {/* EMAIL */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>
            Email
          </Text>

          <View
            style={[
              styles.inputContainer,
              emailError
                ? styles.inputErrorBorder
                : null,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={23}
              color={
                emailError
                  ? "#E91E63"
                  : "#999"
              }
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {emailError ? (
            <Text style={styles.errorText}>
              {emailError}
            </Text>
          ) : null}
        </View>

        {/* PASSWORD */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>
            Password
          </Text>

          <View
            style={[
              styles.inputContainer,
              passwordError
                ? styles.inputErrorBorder
                : null,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={23}
              color={
                passwordError
                  ? "#E91E63"
                  : "#999"
              }
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(!showPassword)
              }
              disabled={loading}
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={23}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {passwordError ? (
            <Text style={styles.errorText}>
              {passwordError}
            </Text>
          ) : null}
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>

          {!loading && (
            <Ionicons
              name="arrow-forward"
              size={25}
              color="#fff"
            />
          )}
        </TouchableOpacity>

        {/* REGISTER */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>
            Don't have an account?{" "}
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            disabled={loading}
          >
            <Text style={styles.registerLink}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7FA",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 35,
    paddingTop: 55,
    paddingBottom: 40,
  },

  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 18,
  },

  appName: {
    fontSize: 29,
    fontWeight: "800",
    color: "#E91E63",
    textAlign: "center",
    marginBottom: 48,
  },

  title: {
    fontSize: 35,
    fontWeight: "800",
    color: "#252525",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 17,
    color: "#888",
    textAlign: "center",
    marginBottom: 55,
  },

  inputSection: {
    marginBottom: 25,
  },

  label: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },

  inputContainer: {
    height: 64,
    borderWidth: 1,
    borderColor: "#E8DDE2",
    borderRadius: 18,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
  },

  inputErrorBorder: {
    borderColor: "#E91E63",
    borderWidth: 1.5,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 17,
    color: "#333",
  },

  errorText: {
    color: "#E91E63",
    fontSize: 14,
    marginTop: 7,
    marginLeft: 4,
    fontWeight: "600",
  },

  loginButton: {
    height: 66,
    borderRadius: 18,
    backgroundColor: "#E91E63",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 12,
  },

  disabledButton: {
    opacity: 0.65,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "800",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },

  registerText: {
    color: "#888",
    fontSize: 16,
  },

  registerLink: {
    color: "#E91E63",
    fontSize: 16,
    fontWeight: "800",
  },
});