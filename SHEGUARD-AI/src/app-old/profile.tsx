import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

const PROFILE_KEY = "@sheguard_profile";

type ProfileData = {
  name: string;
  phone: string;
  email: string;
};

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile =
          await AsyncStorage.getItem(PROFILE_KEY);

        if (savedProfile) {
          const profile: ProfileData =
            JSON.parse(savedProfile);

          setName(profile.name ?? "");
          setPhone(profile.phone ?? "");
          setEmail(profile.email ?? "");
        }
      } catch (error) {
        console.error("Profile Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const saveProfile = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      Alert.alert(
        "Name Required",
        "Please enter your full name."
      );
      return;
    }

    if (!cleanPhone) {
      Alert.alert(
        "Phone Required",
        "Please enter your phone number."
      );
      return;
    }

    if (
      cleanEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setSaving(true);

      const profile: ProfileData = {
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
      };

      await AsyncStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(profile)
      );

      setName(cleanName);
      setPhone(cleanPhone);
      setEmail(cleanEmail);

      Alert.alert(
        "Profile Saved",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error("Profile Save Error:", error);

      Alert.alert(
        "Error",
        "Unable to save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CLEAR PROFILE
  // ==========================================

  const clearProfile = () => {
    Alert.alert(
      "Clear Profile",
      "Are you sure you want to remove all your profile information?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(PROFILE_KEY);

              setName("");
              setPhone("");
              setEmail("");

              Alert.alert(
                "Profile Cleared",
                "Your profile information has been removed."
              );
            } catch (error) {
              console.error(
                "Clear Profile Error:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to clear profile data."
              );
            }
          },
        },
      ]
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons
          name="person-circle-outline"
          size={60}
          color="#E91E63"
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  // ==========================================
  // UI
  // ==========================================

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ======================================
            HEADER
        ====================================== */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#222"
            />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.smallText}>
              SHEGUARD AI
            </Text>

            <Text style={styles.title}>
              My Profile
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="person"
              size={24}
              color="#E91E63"
            />
          </View>
        </View>

        {/* ======================================
            PROFILE AVATAR
        ====================================== */}

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={55}
              color="#E91E63"
            />
          </View>

          <Text style={styles.avatarTitle}>
            Your Safety Profile
          </Text>

          <Text style={styles.avatarText}>
            Keep your information updated for a
            better SHEGUARD AI experience.
          </Text>
        </View>

        {/* ======================================
            PERSONAL INFORMATION
        ====================================== */}

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            Personal Information
          </Text>

          {/* NAME */}

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
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* PHONE */}

          <Text style={styles.label}>
            Phone Number
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={21}
              color="#999"
            />

            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          {/* EMAIL */}

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
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          {/* SAVE BUTTON */}

          <TouchableOpacity
            style={[
              styles.saveButton,
              saving && styles.disabledButton,
            ]}
            onPress={saveProfile}
            disabled={saving}
            activeOpacity={0.8}
          >
            <Ionicons
              name={
                saving
                  ? "hourglass-outline"
                  : "checkmark-circle"
              }
              size={22}
              color="#fff"
            />

            <Text style={styles.saveButtonText}>
              {saving
                ? "Saving..."
                : "Save Profile"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ======================================
            EMERGENCY CONTACTS
        ====================================== */}

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push("/explore")}
          activeOpacity={0.8}
        >
          <View style={styles.optionIcon}>
            <Ionicons
              name="people"
              size={24}
              color="#E91E63"
            />
          </View>

          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>
              Emergency Contacts
            </Text>

            <Text style={styles.optionText}>
              Manage people who should receive SOS
              alerts.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#999"
          />
        </TouchableOpacity>

        {/* ======================================
            PRIVACY CARD
        ====================================== */}

        <View style={styles.safetyCard}>
          <View style={styles.safetyIcon}>
            <Ionicons
              name="shield-checkmark"
              size={25}
              color="#E91E63"
            />
          </View>

          <View style={styles.safetyContent}>
            <Text style={styles.safetyTitle}>
              Your Privacy Matters
            </Text>

            <Text style={styles.safetyText}>
              Your profile information is stored
              locally on your device.
            </Text>
          </View>
        </View>

        {/* ======================================
            CLEAR PROFILE
        ====================================== */}

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearProfile}
          activeOpacity={0.8}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color="#E91E63"
          />

          <Text style={styles.clearText}>
            Clear Profile Data
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7FA",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 45,
    paddingBottom: 120,
  },

  // ========================================
  // LOADING
  // ========================================

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFF7FA",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#777",
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitleContainer: {
    flex: 1,
    marginLeft: 14,
  },

  smallText: {
    fontSize: 13,
    color: "#777",
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#222",
    marginTop: 2,
  },

  headerIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  // ========================================
  // AVATAR
  // ========================================

  avatarSection: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 25,
  },

  avatar: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
    marginTop: 14,
  },

  avatarText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
    maxWidth: 330,
  },

  // ========================================
  // FORM
  // ========================================

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  formTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    marginBottom: 7,
  },

  inputContainer: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFF7FA",
    borderWidth: 1,
    borderColor: "#F5D9E3",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    marginLeft: 10,
  },

  // ========================================
  // SAVE BUTTON
  // ========================================

  saveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#E91E63",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 3,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 7,
  },

  // ========================================
  // OPTION CARD
  // ========================================

  optionCard: {
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  optionContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
  },

  optionText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#888",
    marginTop: 4,
  },

  // ========================================
  // PRIVACY CARD
  // ========================================

  safetyCard: {
    marginTop: 18,
    backgroundColor: "#FFEAF1",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  safetyIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  safetyContent: {
    flex: 1,
    marginLeft: 12,
  },

  safetyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
  },

  safetyText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#777",
    marginTop: 4,
  },

  // ========================================
  // CLEAR BUTTON
  // ========================================

  clearButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F5D9E3",
    marginTop: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
  },

  clearText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E91E63",
    marginLeft: 7,
  },
});