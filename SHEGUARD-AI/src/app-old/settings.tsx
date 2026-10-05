import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SETTINGS_KEY = "@sheguard_settings";
const AUTH_KEY = "@sheguard_logged_in";
const CURRENT_USER_KEY = "@sheguard_current_user";

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

  // Reset Settings Modal
  const [showResetModal, setShowResetModal] =
    useState(false);

  // Sign Out loading
  const [signingOut, setSigningOut] =
    useState(false);

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
      console.error(
        "SHEGUARD AI - Settings Load Error:",
        error
      );
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
      console.error(
        "SHEGUARD AI - Settings Save Error:",
        error
      );

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

  const confirmResetSettings = async () => {
    try {
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(DEFAULT_SETTINGS)
      );

      setSettings(DEFAULT_SETTINGS);

      setShowResetModal(false);

      Alert.alert(
        "Settings Reset",
        "All safety settings have been restored to default."
      );
    } catch (error) {
      console.error(
        "SHEGUARD AI - Reset Settings Error:",
        error
      );

      setShowResetModal(false);

      Alert.alert(
        "Error",
        "Unable to reset settings."
      );
    }
  };

  // ==========================================
  // SIGN OUT
  // ==========================================

  const handleSignOut = async () => {
    if (signingOut) {
      return;
    }

    try {
      setSigningOut(true);

      console.log(
        "SHEGUARD AI: Sign Out started..."
      );

      // ----------------------------------------
      // REMOVE LOGIN SESSION
      // ----------------------------------------

      await AsyncStorage.removeItem(AUTH_KEY);

      // ----------------------------------------
      // REMOVE CURRENT USER
      // ----------------------------------------

      await AsyncStorage.removeItem(
        CURRENT_USER_KEY
      );

      // ----------------------------------------
      // VERIFY SESSION REMOVED
      // ----------------------------------------

      const authCheck =
        await AsyncStorage.getItem(AUTH_KEY);

      const currentUserCheck =
        await AsyncStorage.getItem(
          CURRENT_USER_KEY
        );

      console.log(
        "SHEGUARD AI: Auth after logout:",
        authCheck
      );

      console.log(
        "SHEGUARD AI: Current user after logout:",
        currentUserCheck
      );

      // ----------------------------------------
      // IF LOGOUT SUCCESSFUL
      // ----------------------------------------

      if (
        authCheck === null &&
        currentUserCheck === null
      ) {
        console.log(
          "SHEGUARD AI: Logout successful."
        );

        // Go directly to Login
        router.replace("/login");

        return;
      }

      // ----------------------------------------
      // LOGOUT VERIFICATION FAILED
      // ----------------------------------------

      console.error(
        "SHEGUARD AI: Logout verification failed."
      );

      Alert.alert(
        "Sign Out Error",
        "Unable to clear your login session. Please try again."
      );
    } catch (error) {
      console.error(
        "SHEGUARD AI - Sign Out Error:",
        error
      );

      Alert.alert(
        "Sign Out Error",
        "Unable to sign out. Please try again."
      );
    } finally {
      setSigningOut(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
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
  // MAIN UI
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

        {/* ======================================
            INTRO
        ====================================== */}

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

        {/* ======================================
            EMERGENCY SETTINGS
        ====================================== */}

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

        {/* ======================================
            EMERGENCY CONTACTS
        ====================================== */}

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

        {/* ======================================
            ACCOUNT / PROFILE
        ====================================== */}

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

        {/* ======================================
            PRIVACY & SECURITY
        ====================================== */}

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

        {/* ======================================
            RESET
        ====================================== */}

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setShowResetModal(true)}
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

        {/* ======================================
            SIGN OUT
        ====================================== */}

        <TouchableOpacity
          style={[
            styles.signOutButton,
            signingOut && styles.signOutDisabled,
          ]}
          onPress={handleSignOut}
          disabled={signingOut}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color="#D32F2F"
          />

          <Text style={styles.signOutText}>
            {signingOut
              ? "Signing Out..."
              : "Sign Out"}
          </Text>
        </TouchableOpacity>

        {/* VERSION */}

        <Text style={styles.versionText}>
          SHEGUARD AI • Safety First
        </Text>

      </ScrollView>

      {/* ======================================
          RESET SETTINGS MODAL
      ====================================== */}

      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowResetModal(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <View style={styles.resetModalIcon}>
              <Ionicons
                name="refresh"
                size={30}
                color="#E91E63"
              />
            </View>

            <Text style={styles.modalTitle}>
              Reset Settings?
            </Text>

            <Text style={styles.modalMessage}>
              All safety settings will be restored
              to their default values.
            </Text>

            <View style={styles.modalButtons}>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  setShowResetModal(false)
                }
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmResetButton}
                onPress={confirmResetSettings}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmResetText}>
                  Reset
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

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

  signOutDisabled: {
    opacity: 0.55,
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

  // ==========================================
  // RESET MODAL
  // ==========================================

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  modalCard: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  resetModalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
  },

  modalMessage: {
    fontSize: 14,
    lineHeight: 21,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },

  modalButtons: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginTop: 25,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#555",
  },

  confirmResetButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmResetText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
});