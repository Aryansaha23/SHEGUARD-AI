import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SETTINGS_KEY = "@sheguard_settings";

type SettingsData = {
  sosConfirmation: boolean;
  locationSharing: boolean;
  emergencySound: boolean;
};

const DEFAULT_SETTINGS: SettingsData = {
  sosConfirmation: true,
  locationSharing: true,
  emergencySound: true,
};

export default function SettingsScreen() {
  const [settings, setSettings] =
    useState<SettingsData>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD SETTINGS
  // ==========================================

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings =
        await AsyncStorage.getItem(SETTINGS_KEY);

      if (savedSettings) {
        const parsedSettings: SettingsData =
          JSON.parse(savedSettings);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsedSettings,
        });
      }
    } catch (error) {
      console.error("Settings Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  const saveSettings = async (
    updatedSettings: SettingsData
  ) => {
    try {
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(updatedSettings)
      );

      setSettings(updatedSettings);
    } catch (error) {
      console.error("Settings Save Error:", error);

      Alert.alert(
        "Error",
        "Unable to save settings."
      );
    }
  };

  // ==========================================
  // TOGGLE SETTING
  // ==========================================

  const toggleSetting = (
    key: keyof SettingsData
  ) => {
    const updatedSettings = {
      ...settings,
      [key]: !settings[key],
    };

    saveSettings(updatedSettings);
  };

  // ==========================================
  // RESET SETTINGS
  // ==========================================

  const resetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Do you want to restore all safety settings to default?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await saveSettings(DEFAULT_SETTINGS);

            Alert.alert(
              "Settings Reset",
              "All settings have been restored to default."
            );
          },
        },
      ]
    );
  };

  // ==========================================
  // SIGN OUT
  // ==========================================

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of SHEGUARD AI?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              // Remove login session only.
              // Profile, contacts and safety settings
              // remain stored on the device.
              await AsyncStorage.removeItem(
                "@sheguard_auth"
              );

              router.replace("/login");
            } catch (error) {
              console.error(
                "Sign Out Error:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to sign out. Please try again."
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
          name="settings-outline"
          size={50}
          color="#E91E63"
        />

        <Text style={styles.loadingText}>
          Loading settings...
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

        {/* HEADER */}

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

          <View style={styles.headerText}>
            <Text style={styles.smallText}>
              SHEGUARD AI
            </Text>

            <Text style={styles.title}>
              Safety Settings
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="settings"
              size={24}
              color="#E91E63"
            />
          </View>
        </View>

        {/* INTRO */}

        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="shield-checkmark"
              size={28}
              color="#E91E63"
            />
          </View>

          <View style={styles.introContent}>
            <Text style={styles.introTitle}>
              Your Safety Controls
            </Text>

            <Text style={styles.introText}>
              Customize how SHEGUARD AI responds
              during an emergency.
            </Text>
          </View>
        </View>

        {/* EMERGENCY SETTINGS */}

        <Text style={styles.sectionTitle}>
          Emergency Settings
        </Text>

        <View style={styles.settingsCard}>

          {/* SOS CONFIRMATION */}

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="warning"
                size={23}
                color="#E91E63"
              />
            </View>

            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                SOS Confirmation
              </Text>

              <Text style={styles.settingDescription}>
                Ask for confirmation before sending
                an emergency alert.
              </Text>
            </View>

            <Switch
              value={settings.sosConfirmation}
              onValueChange={() =>
                toggleSetting("sosConfirmation")
              }
              trackColor={{
                false: "#DDD",
                true: "#F6A8C2",
              }}
              thumbColor={
                settings.sosConfirmation
                  ? "#E91E63"
                  : "#f4f3f4"
              }
            />
          </View>

          <View style={styles.divider} />

          {/* LOCATION SHARING */}

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="location"
                size={23}
                color="#E91E63"
              />
            </View>

            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                Location Sharing
              </Text>

              <Text style={styles.settingDescription}>
                Allow your location to be included
                with emergency alerts.
              </Text>
            </View>

            <Switch
              value={settings.locationSharing}
              onValueChange={() =>
                toggleSetting("locationSharing")
              }
              trackColor={{
                false: "#DDD",
                true: "#F6A8C2",
              }}
              thumbColor={
                settings.locationSharing
                  ? "#E91E63"
                  : "#f4f3f4"
              }
            />
          </View>

          <View style={styles.divider} />

          {/* EMERGENCY SOUND */}

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="volume-high"
                size={23}
                color="#E91E63"
              />
            </View>

            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                Emergency Sound
              </Text>

              <Text style={styles.settingDescription}>
                Enable sound feedback when using
                emergency features.
              </Text>
            </View>

            <Switch
              value={settings.emergencySound}
              onValueChange={() =>
                toggleSetting("emergencySound")
              }
              trackColor={{
                false: "#DDD",
                true: "#F6A8C2",
              }}
              thumbColor={
                settings.emergencySound
                  ? "#E91E63"
                  : "#f4f3f4"
              }
            />
          </View>
        </View>

        {/* EMERGENCY CONTACTS */}

        <Text style={styles.sectionTitle}>
          Emergency Contacts
        </Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push("/explore")}
          activeOpacity={0.8}
        >
          <View style={styles.optionIcon}>
            <Ionicons
              name="people"
              size={25}
              color="#E91E63"
            />
          </View>

          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>
              Manage Emergency Contacts
            </Text>

            <Text style={styles.optionText}>
              Add or remove people who should
              receive your SOS alerts.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#999"
          />
        </TouchableOpacity>

        {/* PROFILE */}

        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push("/profile")}
          activeOpacity={0.8}
        >
          <View style={styles.optionIcon}>
            <Ionicons
              name="person"
              size={25}
              color="#E91E63"
            />
          </View>

          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>
              My Profile
            </Text>

            <Text style={styles.optionText}>
              Update your personal information.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#999"
          />
        </TouchableOpacity>

        {/* PRIVACY */}

        <View style={styles.privacyCard}>
          <Ionicons
            name="lock-closed"
            size={23}
            color="#E91E63"
          />

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              Privacy & Security
            </Text>

            <Text style={styles.privacyText}>
              Your settings and profile data are
              stored locally on your device.
            </Text>
          </View>
        </View>

        {/* RESET */}

        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetSettings}
          activeOpacity={0.8}
        >
          <Ionicons
            name="refresh"
            size={20}
            color="#E91E63"
          />

          <Text style={styles.resetText}>
            Reset Safety Settings
          </Text>
        </TouchableOpacity>

        {/* SIGN OUT */}

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color="#D32F2F"
          />

          <Text style={styles.signOutText}>
            Sign Out
          </Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          SHEGUARD AI • Safety First
        </Text>

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
    paddingTop: 45,
    paddingBottom: 120,
  },

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

  headerText: {
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

  intro: {
    marginTop: 28,
    backgroundColor: "#FFEAF1",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  introIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  introContent: {
    flex: 1,
    marginLeft: 13,
  },

  introTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
  },

  introText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#777",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
    marginTop: 28,
    marginBottom: 14,
  },

  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 17,
  },

  settingIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  settingContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
  },

  settingDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: "#888",
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#F3E5EA",
  },

  optionCard: {
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

  privacyCard: {
    marginTop: 18,
    backgroundColor: "#FFEAF1",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  privacyContent: {
    flex: 1,
    marginLeft: 12,
  },

  privacyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
  },

  privacyText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#777",
    marginTop: 4,
  },

  resetButton: {
    height: 48,
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F5D9E3",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  resetText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E91E63",
    marginLeft: 7,
  },

  signOutButton: {
    height: 52,
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: "#FFF1F1",
    borderWidth: 1,
    borderColor: "#F3CACA",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  signOutText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#D32F2F",
    marginLeft: 8,
  },

  versionText: {
    textAlign: "center",
    fontSize: 11,
    color: "#AAA",
    marginTop: 18,
  },
});