import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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

type User = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (
      !cleanName ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill all fields."
      );
      return;
    }

    if (!cleanEmail.includes("@")) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password Error",
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const savedUsers = await AsyncStorage.getItem(USERS_KEY);

      const users: User[] = savedUsers
        ? JSON.parse(savedUsers)
        : [];

      const existingUser = users.find(
        (user) =>
          user.email.toLowerCase() === cleanEmail
      );

      if (existingUser) {
        Alert.alert(
          "Account Exists",
          "An account with this email already exists. Please login."
        );
        return;
      }

      const newUser: User = {
        name: cleanName,
        email: cleanEmail,
        password,
      };

      const updatedUsers = [...users, newUser];

      await AsyncStorage.setItem(
        USERS_KEY,
        JSON.stringify(updatedUsers)
      );

      Alert.alert(
        "Registration Successful",
        "Your SHEGUARD AI account has been created. Please login to continue.",
        [
          {
            text: "Login",
            onPress: () => {
              router.replace("/login");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Registration Error:", error);

      Alert.alert(
        "Registration Error",
        "Unable to create account. Please try again."
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/login")}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#222"
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons
              name="person-add"
              size={35}
              color="#E91E63"
            />
          </View>

          <Text style={styles.brand}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join SHEGUARD AI and stay protected.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            Full Name
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={21}
              color="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.label}>
            Email Address
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={21}
              color="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Create password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={21}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              <Ionicons
                name={
                  showConfirmPassword
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={21}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.registerButtonText}>
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </Text>

            {!loading && (
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#fff"
              />
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.replace("/login")
              }
            >
              <Text style={styles.loginLink}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  brand: {
    fontSize: 25,
    fontWeight: "900",
    color: "#E91E63",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 6,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },

  inputContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: "#E8DDE2",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 17,
    backgroundColor: "#FFFCFD",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#222",
  },

  registerButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#E91E63",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginRight: 8,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  loginText: {
    fontSize: 13,
    color: "#777",
  },

  loginLink: {
    fontSize: 13,
    color: "#E91E63",
    fontWeight: "800",
    marginLeft: 5,
  },
});