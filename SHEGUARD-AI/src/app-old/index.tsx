import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
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

import SafeExitCall from "../components/safe-exit/SafeExitCall";
import {
  requestSmsPermission,
  sendDirectSms,
} from "../utils/directSms";

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

const CONTACTS_KEY = "@sheguard_emergency_contacts";
const PROFILE_KEY = "@sheguard_profile";
const SETTINGS_KEY = "@sheguard_settings";

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
  const [userName, setUserName] = useState("");
  const [settings, setSettings] =
    useState<SettingsData>(DEFAULT_SETTINGS);

  // ==========================================
  // LOAD USER DATA + SMS PERMISSION
  // ==========================================

  useEffect(() => {
    loadUserData();

    // Request SMS permission once when app starts.
    if (Platform.OS === "android") {
      requestSmsPermission().then((granted) => {
        console.log("Initial SMS Permission:", granted);
      });
    }
  }, []);

  // ==========================================
  // LOAD USER DATA
  // ==========================================

  const loadUserData = async () => {
    try {
      // --------------------------------------
      // PROFILE
      // --------------------------------------

      const savedProfile =
        await AsyncStorage.getItem(PROFILE_KEY);

      if (savedProfile) {
        try {
          const profile: ProfileData =
            JSON.parse(savedProfile);

          setUserName(profile.name ?? "");
        } catch (error) {
          console.error(
            "Profile JSON Error:",
            error
          );
        }
      }

      // --------------------------------------
      // SETTINGS
      // --------------------------------------

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
    if (loading) {
      return;
    }

    // Send immediately if confirmation is disabled.
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
          onPress: () => {
            sendSOS();
          },
        },
      ]
    );
  };

  // ==========================================
  // SEND DIRECT SOS SMS
  // ==========================================

  const sendSOS = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // --------------------------------------
      // ANDROID ONLY
      // --------------------------------------

      if (Platform.OS !== "android") {
        Alert.alert(
          "Android Required",
          "Direct emergency SMS is currently available on Android."
        );

        return;
      }

      // --------------------------------------
      // SMS PERMISSION
      // --------------------------------------

      const smsPermission =
        await requestSmsPermission();

      if (!smsPermission) {
        Alert.alert(
          "SMS Permission Required",
          "Please allow SMS permission so SHEGUARD AI can send emergency alerts directly to your trusted contacts."
        );

        return;
      }

      // --------------------------------------
      // LOAD EMERGENCY CONTACTS
      // --------------------------------------

      const savedContacts =
        await AsyncStorage.getItem(CONTACTS_KEY);

      if (!savedContacts) {
        Alert.alert(
          "No Emergency Contacts",
          "Please add at least one emergency contact first.",
          [
            {
              text: "Add Contact",
              onPress: () => {
                router.push("/explore");
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );

        return;
      }

      // --------------------------------------
      // PARSE CONTACTS
      // --------------------------------------

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

      // --------------------------------------
      // VALIDATE CONTACT ARRAY
      // --------------------------------------

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
              onPress: () => {
                router.push("/explore");
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );

        return;
      }

      // --------------------------------------
      // MAXIMUM 5 CONTACTS
      // --------------------------------------

      const selectedContacts =
        contacts.slice(0, 5);

      // --------------------------------------
      // VALID PHONE NUMBERS
      // --------------------------------------

      const validContacts =
        selectedContacts.filter(
          (contact: EmergencyContact) =>
            typeof contact.phone === "string" &&
            contact.phone.trim().length > 0
        );

      if (validContacts.length === 0) {
        Alert.alert(
          "Invalid Contacts",
          "Please add valid phone numbers to your emergency contacts."
        );

        return;
      }

      // --------------------------------------
      // GET USER NAME
      // --------------------------------------

      let currentName = userName;

      if (!currentName.trim()) {
        try {
          const profileData =
            await AsyncStorage.getItem(PROFILE_KEY);

          if (profileData) {
            const profile: ProfileData =
              JSON.parse(profileData);

            currentName =
              profile.name ?? "";
          }
        } catch (error) {
          console.error(
            "Profile Read Error:",
            error
          );
        }
      }

      // --------------------------------------
      // LOCATION
      // --------------------------------------

      let latitude: number | null = null;
      let longitude: number | null = null;

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

        latitude =
          location.coords.latitude;

        longitude =
          location.coords.longitude;

        const mapLink =
          `https://www.google.com/maps?q=${latitude},${longitude}`;

        locationMessage =
          `📍 My Current Location:\n${mapLink}\n\n`;
      } else {
        locationMessage =
          "📍 Location sharing is disabled in Safety Settings.\n\n";
      }

      // --------------------------------------
      // GREETING
      // --------------------------------------

      const greeting =
        currentName.trim().length > 0
          ? `Name: ${currentName.trim()}\n\n`
          : "";

      // --------------------------------------
      // SOS MESSAGE
      // --------------------------------------

      const message =
        `🚨 SHEGUARD AI EMERGENCY ALERT 🚨\n\n` +
        greeting +
        `I may need help. Please check on me immediately.\n\n` +
        locationMessage +
        `Sent from SHEGUARD AI`;

      console.log(
        "===================================="
      );

      console.log(
        "SHEGUARD AI DIRECT SOS"
      );

      console.log(
        "Contacts:",
        validContacts
      );

      console.log(
        "Latitude:",
        latitude
      );

      console.log(
        "Longitude:",
        longitude
      );

      console.log(
        "Message:",
        message
      );

      console.log(
        "===================================="
      );

      // --------------------------------------
      // SEND DIRECT SMS TO ALL CONTACTS
      // --------------------------------------

      let sentCount = 0;
      let failedCount = 0;

      for (const contact of validContacts) {
        try {
          const phoneNumber =
            contact.phone.trim();

          console.log(
            `Sending SOS SMS to ${contact.name}: ${phoneNumber}`
          );

          await sendDirectSms(
            phoneNumber,
            message
          );

          sentCount++;

          console.log(
            `SMS sent successfully to ${contact.name}`
          );
        } catch (error) {
          failedCount++;

          console.error(
            `SMS failed for ${contact.name}:`,
            error
          );
        }
      }

      // --------------------------------------
      // NO SMS SENT
      // --------------------------------------

      if (sentCount === 0) {
        Alert.alert(
          "SOS Failed",
          "SHEGUARD AI could not send the emergency SMS. Please check your SMS permission, SIM card and mobile network."
        );

        return;
      }

      // --------------------------------------
      // ALL SMS SENT
      // --------------------------------------

      if (failedCount === 0) {
        Alert.alert(
          "🚨 SOS Alert Sent",
          `Emergency SOS SMS was sent directly to ${sentCount} emergency contact${
            sentCount > 1 ? "s" : ""
          }.\n\nYour current location was included.`
        );

        return;
      }

      // --------------------------------------
      // PARTIAL SUCCESS
      // --------------------------------------

      Alert.alert(
        "🚨 SOS Partially Sent",
        `SOS SMS was sent to ${sentCount} contact${
          sentCount > 1 ? "s" : ""
        }.\n\n${failedCount} contact${
          failedCount > 1 ? "s" : ""
        } could not be reached.`
      );
    } catch (error) {
      console.error(
        "SOS Error:",
        error
      );

      Alert.alert(
        "SOS Error",
        "Something went wrong while sending the emergency alert."
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
          "Please test live location on an Android phone."
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
                await Linking.openURL(
                  mapLink
                );
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
  // UI
  // ==========================================

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* HEADER */}

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

        {/* GREETING */}

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

        {/* SOS */}

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
                  : "Sending alert..."
                : settings.sosConfirmation
                ? "Tap for Emergency"
                : "Tap to Send SOS"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* STATUS */}

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

        {/* QUICK SAFETY ACTIONS */}

        <Text style={styles.sectionTitle}>
          Quick Safety Actions
        </Text>

        <SafeExitCall
          enabled={true}
          callerName="Mom"
          delay={3000}
        />

        {/* QUICK ACTIONS */}

        <View style={styles.actions}>
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

          <TouchableOpacity
            style={styles.card}
            onPress={handleEmergencyContacts}
            activeOpacity={0.8}
          >
            <View style={styles.cardIcon}>
              <Ionicons
                name="people"
                size={30}
                color="#E91E63"
              />
            </View>

            <Text style={styles.cardTitle}>
              Emergency Contacts
            </Text>

            <Text style={styles.cardText}>
              Manage trusted contacts
            </Text>
          </TouchableOpacity>
        </View>

        {/* SETTINGS */}

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
              SOS confirmation, location
              sharing and emergency
              preferences.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#999"
          />
        </TouchableOpacity>

        {/* SAFETY MESSAGE */}

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
              Your saved emergency contacts
              can receive a direct SOS SMS
              with your current location when
              location sharing is enabled.
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

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 15,
  },

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