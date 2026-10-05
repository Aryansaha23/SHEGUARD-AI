import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SafeExitCall from "../src/components/safe-exit/SafeExitCall";

// ==========================================
// TYPES
// ==========================================

type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
};

type ProfileData = {
  name: string;
  phone: string;
  email: string;
};

type SettingsData = {
  sosConfirmation: boolean;
  locationSharing: boolean;
  emergencySound: boolean;
};

// ==========================================
// STORAGE KEYS
// ==========================================

const AUTH_KEY = "@sheguard_logged_in";
const CONTACTS_KEY = "@sheguard_emergency_contacts";
const PROFILE_KEY = "@sheguard_profile";
const SETTINGS_KEY = "@sheguard_settings";
const CURRENT_USER_KEY = "@sheguard_current_user";

// ==========================================
// DEFAULT SETTINGS
// ==========================================

const DEFAULT_SETTINGS: SettingsData = {
  sosConfirmation: true,
  locationSharing: true,
  emergencySound: true,
};

// ==========================================
// HOME SCREEN
// ==========================================

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [userName, setUserName] = useState("");

  const [settings, setSettings] =
    useState<SettingsData>(DEFAULT_SETTINGS);

  // ==========================================
  // AUTHENTICATION CHECK
  // ==========================================

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem(AUTH_KEY);

      if (loggedIn !== "true") {
        router.replace("/login");
        return;
      }

      await loadUserData();
    } catch (error) {
      console.error("Authentication Check Error:", error);

      router.replace("/login");
    } finally {
      setAuthChecking(false);
    }
  };

  // ==========================================
  // LOAD USER DATA
  // ==========================================

  const loadUserData = async () => {
    try {
      // ========================================
      // PROFILE
      // ========================================

      const savedProfile =
        await AsyncStorage.getItem(PROFILE_KEY);

      if (savedProfile) {
        try {
          const profile: ProfileData =
            JSON.parse(savedProfile);

          setUserName(profile.name ?? "");
        } catch (error) {
          console.error("Profile JSON Error:", error);
        }
      }

      // ========================================
      // CURRENT USER
      // ========================================

      if (!savedProfile) {
        try {
          const currentUser =
            await AsyncStorage.getItem(CURRENT_USER_KEY);

          if (currentUser) {
            const user = JSON.parse(currentUser);

            setUserName(user.name ?? "");
          }
        } catch (error) {
          console.error(
            "Current User Read Error:",
            error
          );
        }
      }

      // ========================================
      // SETTINGS
      // ========================================

      const savedSettings =
        await AsyncStorage.getItem(SETTINGS_KEY);

      if (savedSettings) {
        try {
          const parsedSettings: SettingsData =
            JSON.parse(savedSettings);

          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsedSettings,
          });
        } catch (error) {
          console.error(
            "Settings JSON Error:",
            error
          );

          setSettings(DEFAULT_SETTINGS);
        }
      }
    } catch (error) {
      console.error(
        "User Data Load Error:",
        error
      );
    }
  };

  // ==========================================
  // SOS BUTTON
  // ==========================================

  const handleSOS = () => {
    if (loading) return;

    if (!settings.sosConfirmation) {
      sendSOS();
      return;
    }

    Alert.alert(
      "🚨 Emergency SOS",
      "Are you sure you want to send an emergency alert?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "SEND SOS",
          style: "destructive",
          onPress: sendSOS,
        },
      ]
    );
  };

  // ==========================================
  // SEND SOS
  // ==========================================

  const sendSOS = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // ========================================
      // WEB CHECK
      // ========================================

      if (Platform.OS === "web") {
        Alert.alert(
          "SOS",
          "Please test SOS on a physical Android/iOS phone."
        );

        return;
      }

      // ========================================
      // LOAD CONTACTS
      // ========================================

      const savedContacts =
        await AsyncStorage.getItem(CONTACTS_KEY);

      if (!savedContacts) {
        Alert.alert(
          "No Emergency Contacts",
          "Please add at least one emergency contact first.",
          [
            {
              text: "Add Contact",
              onPress: () => router.push("/explore"),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );

        return;
      }

      let contacts: EmergencyContact[];

      try {
        contacts = JSON.parse(savedContacts);
      } catch (error) {
        console.error(
          "Contact JSON Error:",
          error
        );

        Alert.alert(
          "Contact Error",
          "Unable to read your emergency contacts."
        );

        return;
      }

      if (
        !Array.isArray(contacts) ||
        contacts.length === 0
      ) {
        Alert.alert(
          "No Emergency Contacts",
          "Please add at least one emergency contact first.",
          [
            {
              text: "Add Contact",
              onPress: () => router.push("/explore"),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );

        return;
      }

      // ========================================
      // PHONE NUMBERS
      // ========================================

      const phoneNumbers = contacts
        .map((contact) => contact.phone?.trim())
        .filter(
          (phone): phone is string =>
            Boolean(phone && phone.length > 0)
        );

      if (phoneNumbers.length === 0) {
        Alert.alert(
          "Invalid Contacts",
          "Please add valid phone numbers to your emergency contacts."
        );

        return;
      }

      // ========================================
      // LOCATION
      // ========================================

      let locationMessage = "";

      if (settings.locationSharing) {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Location Permission Required",
            "Please allow location permission so SHEGUARD AI can share your current location."
          );

          return;
        }

        const location =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        const latitude =
          location.coords.latitude;

        const longitude =
          location.coords.longitude;

        const mapLink =
          `https://www.google.com/maps?q=${latitude},${longitude}`;

        locationMessage =
          `📍 My Current Location:\n${mapLink}\n\n`;
      } else {
        locationMessage =
          "📍 Location sharing is currently disabled in Safety Settings.\n\n";
      }

      // ========================================
      // USER NAME
      // ========================================

      let currentName = userName;

      if (!currentName) {
        try {
          const profileData =
            await AsyncStorage.getItem(PROFILE_KEY);

          if (profileData) {
            const profile: ProfileData =
              JSON.parse(profileData);

            currentName = profile.name ?? "";
          }
        } catch (error) {
          console.error(
            "Profile Read Error:",
            error
          );
        }
      }

      // ========================================
      // MESSAGE
      // ========================================

      const greeting =
        currentName.trim().length > 0
          ? `Name: ${currentName.trim()}\n\n`
          : "";

      const message =
        `🚨 SHEGUARD AI EMERGENCY ALERT 🚨\n\n` +
        `${greeting}` +
        `I may need help. Please check on me immediately.\n\n` +
        `${locationMessage}` +
        `Sent from SHEGUARD AI`;

      // ========================================
      // SMS
      // ========================================

      const smsAvailable =
        await SMS.isAvailableAsync();

      if (!smsAvailable) {
        Alert.alert(
          "SMS Not Available",
          "SMS is not available on this device."
        );

        return;
      }

      const result =
        await SMS.sendSMSAsync(
          phoneNumbers,
          message
        );

      if (result.result === "sent") {
        Alert.alert(
          "✅ SOS Sent",
          `Emergency message sent to ${phoneNumbers.length} contact${
            phoneNumbers.length > 1 ? "s" : ""
          }.`
        );
      } else {
        Alert.alert(
          "SOS Ready",
          "The SMS screen was opened. Please review and send the emergency message."
        );
      }
    } catch (error) {
      console.error("SOS Error:", error);

      Alert.alert(
        "SOS Error",
        "Something went wrong while preparing the emergency alert. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LIVE LOCATION
  // ==========================================

  const handleLiveLocation = async () => {
    try {
      if (Platform.OS === "web") {
        Alert.alert(
          "Live Location",
          "Please test live location on a physical Android/iOS phone."
        );

        return;
      }

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is required."
        );

        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const latitude =
        location.coords.latitude;

      const longitude =
        location.coords.longitude;

      const mapLink =
        `https://www.google.com/maps?q=${latitude},${longitude}`;

      Alert.alert(
        "📍 Your Current Location",
        `Latitude: ${latitude.toFixed(
          6
        )}\nLongitude: ${longitude.toFixed(6)}`,
        [
          {
            text: "Open Maps",
            onPress: async () => {
              try {
                await Linking.openURL(mapLink);
              } catch (error) {
                console.error(
                  "Maps Error:",
                  error
                );

                Alert.alert(
                  "Error",
                  "Unable to open Google Maps."
                );
              }
            },
          },
          {
            text: "Close",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error(
        "Location Error:",
        error
      );

      Alert.alert(
        "Location Error",
        "Unable to get your current location."
      );
    }
  };

  // ==========================================
  // SAFE LOCATION
  // ==========================================

  const handleSafeLocation = async () => {
    try {
      // ========================================
      // WEB CHECK
      // ========================================

      if (Platform.OS === "web") {
        Alert.alert(
          "Safe Location",
          "Please test Safe Location on a physical Android/iOS phone."
        );

        return;
      }

      // ========================================
      // LOCATION PERMISSION
      // ========================================

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please allow location permission to find nearby safe places."
        );

        return;
      }

      // ========================================
      // GET CURRENT LOCATION
      // ========================================

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const latitude =
        location.coords.latitude;

      const longitude =
        location.coords.longitude;

      // ========================================
      // GOOGLE MAPS URLS
      // ========================================

      const currentLocationUrl =
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      const policeUrl =
        `https://www.google.com/maps/search/?api=1&query=police+station+near+${latitude},${longitude}`;

      const hospitalUrl =
        `https://www.google.com/maps/search/?api=1&query=hospital+near+${latitude},${longitude}`;

      const safePlaceUrl =
        `https://www.google.com/maps/search/?api=1&query=safe+place+near+${latitude},${longitude}`;

      const pharmacyUrl =
        `https://www.google.com/maps/search/?api=1&query=pharmacy+near+${latitude},${longitude}`;

      // ========================================
      // SAFE LOCATION MENU
      // ========================================

      Alert.alert(
        "🛡️ Safe Location",
        "Your current location has been detected.\n\n" +
          `Latitude: ${latitude.toFixed(6)}\n` +
          `Longitude: ${longitude.toFixed(6)}\n\n` +
          "Choose what you want to find:",
        [
          // ====================================
          // POLICE
          // ====================================

          {
            text: "🚓 Police Station",
            onPress: async () => {
              try {
                await Linking.openURL(policeUrl);
              } catch (error) {
                console.error(
                  "Police Maps Error:",
                  error
                );

                Alert.alert(
                  "Error",
                  "Unable to open nearby police stations."
                );
              }
            },
          },

          // ====================================
          // HOSPITAL
          // ====================================

          {
            text: "🏥 Hospital",
            onPress: async () => {
              try {
                await Linking.openURL(hospitalUrl);
              } catch (error) {
                console.error(
                  "Hospital Maps Error:",
                  error
                );

                Alert.alert(
                  "Error",
                  "Unable to open nearby hospitals."
                );
              }
            },
          },

          // ====================================
          // SAFE PLACES
          // ====================================

          {
            text: "🛡️ Safe Places",
            onPress: async () => {
              try {
                await Linking.openURL(safePlaceUrl);
              } catch (error) {
                console.error(
                  "Safe Places Error:",
                  error
                );

                Alert.alert(
                  "Error",
                  "Unable to open nearby safe places."
                );
              }
            },
          },

          // ====================================
          // PHARMACY
          // ====================================

          {
            text: "💊 Pharmacy",
            onPress: async () => {
              try {
                await Linking.openURL(pharmacyUrl);
              } catch (error) {
                console.error(
                  "Pharmacy Maps Error:",
                  error
                );

                Alert.alert(
                  "Error",
                  "Unable to open nearby pharmacies."
                );
              }
            },
          },

          // ====================================
          // CURRENT LOCATION
          // ====================================

          {
            text: "📍 Open My Location",
            onPress: async () => {
              try {
                await Linking.openURL(
                  currentLocationUrl
                );
              } catch (error) {
                console.error(
                  "Current Location Error:",
                  error
                );

                Alert.alert(
                  "Error",
                  "Unable to open your current location."
                );
              }
            },
          },

          // ====================================
          // CLOSE
          // ====================================

          {
            text: "Close",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error(
        "Safe Location Error:",
        error
      );

      Alert.alert(
        "Safe Location Error",
        "Unable to detect your current location. Please try again."
      );
    }
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleEmergencyContacts = () => {
    router.push("/explore");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  // ==========================================
  // AUTH LOADING SCREEN
  // ==========================================

  if (authChecking) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <Ionicons
            name="shield-checkmark"
            size={42}
            color="#E91E63"
          />
        </View>

        <Text style={styles.loadingLogo}>
          SHEGUARD AI
        </Text>

        <Text style={styles.loadingText}>
          Checking secure session...
        </Text>
      </View>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ======================================
            HEADER
        ====================================== */}

        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>
              {userName
                ? `Welcome, ${userName}`
                : "Welcome to"}
            </Text>

            <Text style={styles.logo}>
              SHEGUARD AI
            </Text>
          </View>

          <View style={styles.headerActions}>
            {/* SETTINGS */}

            <TouchableOpacity
              style={styles.headerButton}
              activeOpacity={0.8}
              onPress={handleSettings}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color="#E91E63"
              />
            </TouchableOpacity>

            {/* PROFILE */}

            <TouchableOpacity
              style={[
                styles.headerButton,
                styles.profileButton,
              ]}
              activeOpacity={0.8}
              onPress={handleProfile}
            >
              <Ionicons
                name="person"
                size={22}
                color="#E91E63"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ======================================
            GREETING
        ====================================== */}

        <View style={styles.greeting}>
          <Text style={styles.title}>
            Your Safety,
          </Text>

          <Text style={styles.titlePink}>
            Our Priority.
          </Text>

          <Text style={styles.description}>
            Stay protected with intelligent
            safety assistance whenever you
            need it.
          </Text>
        </View>

        {/* ======================================
            SOS
        ====================================== */}

        <View style={styles.sosSection}>
          <TouchableOpacity
            style={[
              styles.sosButton,
              loading &&
                styles.sosButtonDisabled,
            ]}
            onPress={handleSOS}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Ionicons
              name="warning"
              size={48}
              color="#fff"
            />

            <Text style={styles.sosText}>
              {loading ? "..." : "SOS"}
            </Text>

            <Text style={styles.sosSubtext}>
              {loading
                ? settings.locationSharing
                  ? "Getting location..."
                  : "Preparing alert..."
                : settings.sosConfirmation
                ? "Tap for Emergency"
                : "Tap to Send SOS"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ======================================
            STATUS
        ====================================== */}

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name={
                settings.locationSharing
                  ? "location"
                  : "location-outline"
              }
              size={22}
              color="#E91E63"
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              SOS Protection
            </Text>

            <Text style={styles.statusText}>
              {settings.locationSharing
                ? "Location sharing is enabled."
                : "SOS location sharing is disabled."}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSettings}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* ======================================
            QUICK SAFETY ACTIONS
        ====================================== */}

        <Text style={styles.sectionTitle}>
          Quick Safety Actions
        </Text>

        {/* SAFE EXIT */}

        <SafeExitCall
          enabled={true}
          callerName="Mom"
          delay={3000}
        />

        {/* ======================================
            QUICK ACTIONS
        ====================================== */}

        <View style={styles.actions}>
          {/* LIVE LOCATION */}

          <TouchableOpacity
            style={styles.card}
            onPress={handleLiveLocation}
            activeOpacity={0.8}
          >
            <View style={styles.cardIcon}>
              <Ionicons
                name="location"
                size={30}
                color="#E91E63"
              />
            </View>

            <Text style={styles.cardTitle}>
              Live Location
            </Text>

            <Text style={styles.cardText}>
              View your current location
            </Text>
          </TouchableOpacity>

          {/* SAFE LOCATION */}

          <TouchableOpacity
            style={styles.card}
            onPress={handleSafeLocation}
            activeOpacity={0.8}
          >
            <View style={styles.cardIcon}>
              <Ionicons
                name="shield-checkmark"
                size={30}
                color="#E91E63"
              />
            </View>

            <Text style={styles.cardTitle}>
              Safe Location
            </Text>

            <Text style={styles.cardText}>
              Find nearby police, hospitals
              and safe places
            </Text>
          </TouchableOpacity>
        </View>

        {/* ======================================
            EMERGENCY CONTACTS
        ====================================== */}

        <TouchableOpacity
          style={styles.settingsCard}
          onPress={handleEmergencyContacts}
          activeOpacity={0.8}
        >
          <View style={styles.settingsIcon}>
            <Ionicons
              name="people"
              size={26}
              color="#E91E63"
            />
          </View>

          <View style={styles.settingsContent}>
            <Text style={styles.settingsTitle}>
              Emergency Contacts
            </Text>

            <Text style={styles.settingsText}>
              Manage your trusted emergency
              contacts.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#999"
          />
        </TouchableOpacity>

        {/* ======================================
            SAFETY SETTINGS
        ====================================== */}

        <TouchableOpacity
          style={styles.settingsCard}
          onPress={handleSettings}
          activeOpacity={0.8}
        >
          <View style={styles.settingsIcon}>
            <Ionicons
              name="shield-checkmark"
              size={26}
              color="#E91E63"
            />
          </View>

          <View style={styles.settingsContent}>
            <Text style={styles.settingsTitle}>
              Safety Settings
            </Text>

            <Text style={styles.settingsText}>
              SOS confirmation, location sharing
              and emergency preferences.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#999"
          />
        </TouchableOpacity>

        {/* ======================================
            SAFETY MESSAGE
        ====================================== */}

        <View style={styles.safetyCard}>
          <Ionicons
            name="shield-checkmark"
            size={24}
            color="#E91E63"
          />

          <View style={styles.safetyContent}>
            <Text style={styles.safetyTitle}>
              Stay Safe with SHEGUARD AI
            </Text>

            <Text style={styles.safetyText}>
              Your saved emergency contacts can
              receive an SOS alert and your current
              location when location sharing is
              enabled.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 55,
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

  loadingIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingLogo: {
    fontSize: 25,
    fontWeight: "900",
    color: "#E91E63",
    marginTop: 15,
  },

  loadingText: {
    fontSize: 13,
    color: "#888",
    marginTop: 8,
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallText: {
    fontSize: 14,
    color: "#777",
  },

  logo: {
    fontSize: 25,
    fontWeight: "800",
    color: "#E91E63",
    marginTop: 2,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  profileButton: {
    backgroundColor: "#FFF0F5",
  },

  // ========================================
  // GREETING
  // ========================================

  greeting: {
    marginTop: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#222",
  },

  titlePink: {
    fontSize: 32,
    fontWeight: "800",
    color: "#E91E63",
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginTop: 12,
    maxWidth: 500,
  },

  // ========================================
  // SOS
  // ========================================

  sosSection: {
    alignItems: "center",
    marginTop: 35,
    marginBottom: 22,
  },

  sosButton: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#E91E63",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  sosButtonDisabled: {
    opacity: 0.7,
  },

  sosText: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 4,
  },

  sosSubtext: {
    color: "#fff",
    fontSize: 13,
    marginTop: 2,
  },

  // ========================================
  // STATUS
  // ========================================

  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  statusContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#222",
  },

  statusText: {
    fontSize: 12,
    color: "#888",
    marginTop: 3,
  },

  // ========================================
  // SECTION
  // ========================================

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 15,
  },

  // ========================================
  // QUICK ACTIONS
  // ========================================

  actions: {
    flexDirection: "row",
    gap: 12,
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    minHeight: 155,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
    marginTop: 10,
  },

  cardText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#888",
    marginTop: 4,
  },

  // ========================================
  // SETTINGS CARDS
  // ========================================

  settingsCard: {
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

  settingsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  settingsContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  settingsTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
  },

  settingsText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#888",
    marginTop: 4,
  },

  // ========================================
  // SAFETY CARD
  // ========================================

  safetyCard: {
    marginTop: 20,
    backgroundColor: "#FFEAF1",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
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
});