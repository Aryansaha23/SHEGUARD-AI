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

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
};

export const STORAGE_KEY = "@sheguard_emergency_contacts";

const MAX_CONTACTS = 5;

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD CONTACTS
  // ==========================================

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setContacts([]);
        return;
      }

      const parsed: unknown = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        setContacts([]);
        return;
      }

      const validContacts: EmergencyContact[] = parsed.filter(
        (item): item is EmergencyContact =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as EmergencyContact).id === "string" &&
          typeof (item as EmergencyContact).name === "string" &&
          typeof (item as EmergencyContact).phone === "string"
      );

      setContacts(validContacts.slice(0, MAX_CONTACTS));
    } catch (error) {
      console.error("Load contacts error:", error);

      Alert.alert(
        "Error",
        "Unable to load emergency contacts."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SAVE CONTACTS
  // ==========================================

  const saveContacts = async (
    updatedContacts: EmergencyContact[]
  ): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedContacts)
      );

      setContacts(updatedContacts);

      return true;
    } catch (error) {
      console.error("Save contacts error:", error);

      Alert.alert(
        "Error",
        "Unable to save emergency contacts."
      );

      return false;
    }
  };

  // ==========================================
  // ADD CONTACT
  // ==========================================

  const addContact = async () => {
    if (saving) {
      return;
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    // NAME VALIDATION
    if (!cleanName) {
      Alert.alert(
        "Missing Name",
        "Please enter the contact name."
      );
      return;
    }

    if (cleanName.length < 2) {
      Alert.alert(
        "Invalid Name",
        "Please enter a valid contact name."
      );
      return;
    }

    // PHONE VALIDATION
    if (!cleanPhone) {
      Alert.alert(
        "Missing Phone",
        "Please enter the phone number."
      );
      return;
    }

    const normalizedPhone = cleanPhone.replace(/\D/g, "");

    if (normalizedPhone.length < 10) {
      Alert.alert(
        "Invalid Phone",
        "Please enter a valid phone number."
      );
      return;
    }

    // MAX CONTACTS
    if (contacts.length >= MAX_CONTACTS) {
      Alert.alert(
        "Maximum Contacts",
        `You can add up to ${MAX_CONTACTS} emergency contacts.`
      );
      return;
    }

    // DUPLICATE CHECK
    const alreadyExists = contacts.some(
      (contact) =>
        contact.phone.replace(/\D/g, "") === normalizedPhone
    );

    if (alreadyExists) {
      Alert.alert(
        "Already Added",
        "This phone number is already an emergency contact."
      );
      return;
    }

    try {
      setSaving(true);

      const newContact: EmergencyContact = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        name: cleanName,
        phone: cleanPhone,
      };

      const updatedContacts = [
        ...contacts,
        newContact,
      ];

      const success = await saveContacts(
        updatedContacts
      );

      if (success) {
        setName("");
        setPhone("");

        Alert.alert(
          "Contact Added",
          `${cleanName} has been added successfully.`
        );
      }
    } catch (error) {
      console.error("Add contact error:", error);

      Alert.alert(
        "Error",
        "Unable to add emergency contact."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE CONTACT
  // ==========================================

  const deleteContact = (id: string) => {
    const contact = contacts.find(
      (item) => item.id === id
    );

    if (!contact) {
      return;
    }

    Alert.alert(
      "Delete Contact",
      `Remove ${contact.name} from emergency contacts?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedContacts = contacts.filter(
              (item) => item.id !== id
            );

            await saveContacts(updatedContacts);
          },
        },
      ]
    );
  };

  // ==========================================
  // GO BACK
  // ==========================================

  const handleBack = () => {
    router.back();
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons
          name="people-outline"
          size={60}
          color="#E91E63"
        />

        <Text style={styles.loadingText}>
          Loading contacts...
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
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {/* ======================================
            HEADER
        ====================================== */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#222"
            />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.smallText}>
              SHEGUARD AI
            </Text>

            <Text style={styles.title}>
              Emergency Contacts
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="people"
              size={25}
              color="#E91E63"
            />
          </View>
        </View>

        {/* ======================================
            DESCRIPTION
        ====================================== */}

        <Text style={styles.description}>
          Add trusted people who should receive your
          emergency alert and location.
        </Text>

        {/* ======================================
            ADD CONTACT CARD
        ====================================== */}

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              Add Emergency Contact
            </Text>

            <Text style={styles.formCount}>
              {contacts.length}/{MAX_CONTACTS}
            </Text>
          </View>

          {/* NAME */}

          <Text style={styles.inputLabel}>
            Contact Name
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
              placeholder="e.g. Mother, Father, Friend"
              placeholderTextColor="#999"
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!saving}
              returnKeyType="next"
            />
          </View>

          {/* PHONE */}

          <Text style={styles.inputLabel}>
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
              editable={!saving}
              maxLength={15}
              returnKeyType="done"
              onSubmitEditing={addContact}
            />
          </View>

          {/* ADD BUTTON */}

          <TouchableOpacity
            style={[
              styles.addButton,
              saving && styles.disabledButton,
              contacts.length >= MAX_CONTACTS &&
                styles.disabledButton,
            ]}
            onPress={addContact}
            disabled={
              saving ||
              contacts.length >= MAX_CONTACTS
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name={
                saving
                  ? "hourglass-outline"
                  : "add-circle-outline"
              }
              size={23}
              color="#fff"
            />

            <Text style={styles.addButtonText}>
              {saving
                ? "Saving..."
                : contacts.length >= MAX_CONTACTS
                ? "Maximum Reached"
                : "Add Contact"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ======================================
            CONTACT LIST HEADER
        ====================================== */}

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Your Emergency Contacts
            </Text>

            <Text style={styles.sectionSubtitle}>
              These people will receive your SOS alert.
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {contacts.length}/{MAX_CONTACTS}
            </Text>
          </View>
        </View>

        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {contacts.length === 0 && (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="people-outline"
                size={36}
                color="#E91E63"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Emergency Contacts
            </Text>

            <Text style={styles.emptyText}>
              Add someone you trust so they can
              receive your SOS alert and location.
            </Text>
          </View>
        )}

        {/* ======================================
            CONTACT LIST
        ====================================== */}

        {contacts.map((contact, index) => (
          <View
            key={contact.id}
            style={styles.contactCard}
          >
            <View style={styles.contactIcon}>
              <Ionicons
                name="person"
                size={23}
                color="#E91E63"
              />
            </View>

            <View style={styles.contactInfo}>
              <View style={styles.contactNameRow}>
                <Text
                  style={styles.contactName}
                  numberOfLines={1}
                >
                  {contact.name}
                </Text>

                {index === 0 && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryText}>
                      PRIMARY
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.contactPhone}>
                {contact.phone}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                deleteContact(contact.id)
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={21}
                color="#E91E63"
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* ======================================
            INFO CARD
        ====================================== */}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="shield-checkmark"
              size={24}
              color="#E91E63"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Your contacts stay private
            </Text>

            <Text style={styles.infoText}>
              Emergency contacts are stored locally
              on your device and are used when you
              trigger SOS.
            </Text>
          </View>
        </View>

        {/* ======================================
            BACK BUTTON
        ====================================== */}

        <TouchableOpacity
          style={styles.bottomBackButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={19}
            color="#E91E63"
          />

          <Text style={styles.bottomBackText}>
            Back
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

  content: {
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
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  smallText: {
    fontSize: 13,
    color: "#777",
    marginBottom: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#222",
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  // ========================================
  // DESCRIPTION
  // ========================================

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#777",
    marginTop: 16,
    marginBottom: 22,
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

  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },

  formCount: {
    fontSize: 13,
    fontWeight: "800",
    color: "#E91E63",
    backgroundColor: "#FFE4EE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  inputLabel: {
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
    marginBottom: 14,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    marginLeft: 10,
  },

  addButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#E91E63",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 3,
  },

  disabledButton: {
    opacity: 0.55,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 7,
  },

  // ========================================
  // LIST HEADER
  // ========================================

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },

  countBadge: {
    minWidth: 45,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 9,
  },

  countText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#E91E63",
  },

  // ========================================
  // EMPTY
  // ========================================

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },

  // ========================================
  // CONTACT
  // ========================================

  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE4EE",
    justifyContent: "center",
    alignItems: "center",
  },

  contactInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  contactNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  contactName: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
  },

  primaryBadge: {
    marginLeft: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#FFE4EE",
  },

  primaryText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#E91E63",
  },

  contactPhone: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },

  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF0F5",
    justifyContent: "center",
    alignItems: "center",
  },

  // ========================================
  // INFO
  // ========================================

  infoCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFEAF1",
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: 11,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#222",
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#777",
    marginTop: 4,
  },

  // ========================================
  // BOTTOM BACK
  // ========================================

  bottomBackButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F5D9E3",
    backgroundColor: "#fff",
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomBackText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E91E63",
    marginLeft: 6,
  },
});