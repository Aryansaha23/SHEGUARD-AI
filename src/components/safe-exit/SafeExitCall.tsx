import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SafeExitCallProps = {
  enabled?: boolean;
  callerName?: string;
  delay?: number;
};

export default function SafeExitCall({
  enabled = true,
  callerName = "Mom",
  delay = 3000,
}: SafeExitCallProps) {
  const [calling, setCalling] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ==========================================
  // START SAFE EXIT CALL
  // ==========================================

  const startSafeExitCall = () => {
    if (calling || modalVisible) return;

    setCalling(true);

    // Web testing
    if (Platform.OS === "web") {
      timerRef.current = setTimeout(() => {
        setCalling(false);
        setModalVisible(true);
      }, delay);

      return;
    }

    // Android / iOS
    timerRef.current = setTimeout(() => {
      setCalling(false);
      setModalVisible(true);
    }, delay);
  };

  // ==========================================
  // ACCEPT CALL
  // ==========================================

  const acceptCall = () => {
    setModalVisible(false);

    Alert.alert(
      "📞 Safe Exit Call",
      `Call connected with ${callerName}.`,
    );
  };

  // ==========================================
  // DECLINE CALL
  // ==========================================

  const declineCall = () => {
    setModalVisible(false);
    setCalling(false);
  };

  // ==========================================
  // CLEANUP TIMER
  // ==========================================

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      {/* ======================================
          SAFE EXIT CALL CARD
      ====================================== */}

      <TouchableOpacity
        style={[
          styles.card,
          !enabled && styles.disabledCard,
        ]}
        activeOpacity={0.8}
        onPress={startSafeExitCall}
        disabled={!enabled || calling}
      >
        {/* ICON */}

        <View style={styles.iconContainer}>
          <Ionicons
            name="call"
            size={28}
            color="#E91E63"
          />
        </View>

        {/* CONTENT */}

        <View style={styles.content}>
          <Text style={styles.title}>
            Safe Exit Call
          </Text>

          <Text style={styles.subtitle}>
            {calling
              ? `Incoming call from ${callerName}...`
              : `Tap to receive a call from ${callerName}`}
          </Text>
        </View>

        {/* ARROW */}

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#999"
        />
      </TouchableOpacity>

      {/* ======================================
          INCOMING CALL MODAL
      ====================================== */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={declineCall}
      >
        {/* DARK BACKGROUND */}

        <View style={styles.modalOverlay}>
          {/* CALL BOX */}

          <View style={styles.callContainer}>
            {/* PERSON ICON */}

            <View style={styles.callIcon}>
              <Ionicons
                name="person"
                size={44}
                color="#E91E63"
              />
            </View>

            {/* INCOMING CALL */}

            <Text style={styles.incomingText}>
              Incoming Call
            </Text>

            {/* CALLER */}

            <Text style={styles.callerName}>
              {callerName}
            </Text>

            {/* APP NAME */}

            <Text style={styles.callType}>
              SHEGUARD Safe Exit
            </Text>

            {/* CALL BUTTONS */}

            <View style={styles.callActions}>
              {/* DECLINE */}

              <TouchableOpacity
                style={[
                  styles.callButton,
                  styles.declineButton,
                ]}
                activeOpacity={0.8}
                onPress={declineCall}
              >
                <Ionicons
                  name="call"
                  size={26}
                  color="#FFFFFF"
                />

                <Text style={styles.buttonText}>
                  Decline
                </Text>
              </TouchableOpacity>

              {/* ANSWER */}

              <TouchableOpacity
                style={[
                  styles.callButton,
                  styles.acceptButton,
                ]}
                activeOpacity={0.8}
                onPress={acceptCall}
              >
                <Ionicons
                  name="call"
                  size={26}
                  color="#FFFFFF"
                />

                <Text style={styles.buttonText}>
                  Answer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  // ========================================
  // CARD
  // ========================================

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  disabledCard: {
    opacity: 0.5,
  },

  // ========================================
  // ICON
  // ========================================

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFE4EE",

    justifyContent: "center",
    alignItems: "center",
  },

  // ========================================
  // CONTENT
  // ========================================

  content: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },

  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222222",
  },

  subtitle: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },

  // ========================================
  // MODAL OVERLAY
  // ========================================

  modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.65)",

    justifyContent: "center",
    alignItems: "center",

    padding: 24,
  },

  // ========================================
  // CALL CONTAINER
  // ========================================

  callContainer: {
    width: "100%",
    maxWidth: 380,

    backgroundColor: "#FFFFFF",

    borderRadius: 30,

    padding: 30,

    alignItems: "center",

    elevation: 10,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,

    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  // ========================================
  // CALL ICON
  // ========================================

  callIcon: {
    width: 90,
    height: 90,

    borderRadius: 45,

    backgroundColor: "#FFE4EE",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 18,
  },

  // ========================================
  // TEXT
  // ========================================

  incomingText: {
    fontSize: 16,

    color: "#888888",

    fontWeight: "600",
  },

  callerName: {
    fontSize: 30,

    fontWeight: "900",

    color: "#222222",

    marginTop: 6,
  },

  callType: {
    fontSize: 13,

    color: "#E91E63",

    marginTop: 6,

    fontWeight: "600",
  },

  // ========================================
  // BUTTON AREA
  // ========================================

  callActions: {
    flexDirection: "row",

    gap: 18,

    marginTop: 35,
  },

  // ========================================
  // BUTTON
  // ========================================

  callButton: {
    width: 120,
    height: 58,

    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    gap: 8,
  },

  declineButton: {
    backgroundColor: "#D32F2F",
  },

  acceptButton: {
    backgroundColor: "#43A047",
  },

  buttonText: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "800",
  },
});