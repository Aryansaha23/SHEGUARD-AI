import { Ionicons } from "@expo/vector-icons";
import { Accelerometer } from "expo-sensors";
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
  const [connected, setConnected] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const lastShakeTimeRef = useRef(0);

  // ==========================================
  // START SAFE EXIT CALL
  // ==========================================

  const startSafeExitCall = () => {
    if (!enabled) return;
    if (calling || modalVisible) return;

    setCalling(true);
    setConnected(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setModalVisible(true);
      setCalling(false);
    }, delay);
  };

  // ==========================================
  // SHAKE DETECTION
  // ==========================================

  useEffect(() => {
    if (!enabled) return;

    // ----------------------------------------
    // SHAKE NOT NEEDED ON WEBSITE
    // ----------------------------------------

    if (Platform.OS === "web") {
      return;
    }

    let subscription: ReturnType<
      typeof Accelerometer.addListener
    > | null = null;

    const setupShakeDetection = async () => {
      try {
        const available =
          await Accelerometer.isAvailableAsync();

        if (!available) {
          console.log(
            "Accelerometer is not available on this device."
          );
          return;
        }

        Accelerometer.setUpdateInterval(100);

        subscription = Accelerometer.addListener(
          ({ x, y, z }) => {
            const acceleration = Math.sqrt(
              x * x + y * y + z * z
            );

            const now = Date.now();

            // --------------------------------
            // SHAKE THRESHOLD
            // --------------------------------

            const SHAKE_THRESHOLD = 2.2;

            // --------------------------------
            // PREVENT MULTIPLE TRIGGERS
            // --------------------------------

            const SHAKE_COOLDOWN = 4000;

            if (
              acceleration > SHAKE_THRESHOLD &&
              now - lastShakeTimeRef.current >
                SHAKE_COOLDOWN
            ) {
              lastShakeTimeRef.current = now;

              startSafeExitCall();
            }
          }
        );
      } catch (error) {
        console.log(
          "Shake detection error:",
          error
        );
      }
    };

    setupShakeDetection();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [enabled, calling, modalVisible]);

  // ==========================================
  // ANSWER CALL
  // ==========================================

  const acceptCall = () => {
    setConnected(true);

    setTimeout(() => {
      setModalVisible(false);
      setConnected(false);

      Alert.alert(
        "Safe Exit Call",
        `Call ended with ${callerName}.`
      );
    }, 1500);
  };

  // ==========================================
  // DECLINE CALL
  // ==========================================

  const declineCall = () => {
    setModalVisible(false);
    setConnected(false);
  };

  // ==========================================
  // CLEANUP
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
        <View style={styles.iconContainer}>
          <Ionicons
            name="call"
            size={28}
            color="#E91E63"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Safe Exit Call
          </Text>

          <Text style={styles.subtitle}>
            {calling
              ? "Preparing incoming call..."
              : `Tap to receive a call from ${callerName}`}
          </Text>

          {/* PHONE ONLY */}

          {Platform.OS !== "web" && (
            <Text style={styles.shakeText}>
              Shake your phone to trigger
            </Text>
          )}
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#999"
        />
      </TouchableOpacity>

      {/* ======================================
          INCOMING CALL
      ====================================== */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={declineCall}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.callContainer}>
            {/* CALLER ICON */}

            <View style={styles.callIcon}>
              <Ionicons
                name="person"
                size={42}
                color="#E91E63"
              />
            </View>

            {/* STATUS */}

            <Text style={styles.incomingText}>
              {connected
                ? "Call Connected"
                : "Incoming Call"}
            </Text>

            {/* CALLER */}

            <Text style={styles.callerName}>
              {callerName}
            </Text>

            <Text style={styles.callType}>
              SHEGUARD Safe Exit
            </Text>

            {/* ==================================
                BUTTONS
            ================================== */}

            {!connected ? (
              <View style={styles.callActions}>
                {/* DECLINE */}

                <TouchableOpacity
                  style={[
                    styles.callButton,
                    styles.declineButton,
                  ]}
                  onPress={declineCall}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="call"
                    size={28}
                    color="#fff"
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
                  onPress={acceptCall}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="call"
                    size={28}
                    color="#fff"
                  />

                  <Text style={styles.buttonText}>
                    Answer
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.connectedBox}>
                <Ionicons
                  name="call"
                  size={24}
                  color="#43A047"
                />

                <Text style={styles.connectedText}>
                  Connected...
                </Text>
              </View>
            )}
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

  iconContainer: {
    width: 52,
    height: 52,

    borderRadius: 26,

    backgroundColor: "#FFE4EE",

    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,

    marginLeft: 14,
    marginRight: 8,
  },

  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
  },

  subtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },

  shakeText: {
    fontSize: 11,
    color: "#E91E63",
    fontWeight: "600",
    marginTop: 5,
  },

  // ========================================
  // MODAL
  // ========================================

  modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.65)",

    justifyContent: "center",
    alignItems: "center",

    padding: 24,
  },

  callContainer: {
    width: "100%",
    maxWidth: 380,

    backgroundColor: "#FFFFFF",

    borderRadius: 30,

    padding: 30,

    alignItems: "center",
  },

  callIcon: {
    width: 90,
    height: 90,

    borderRadius: 45,

    backgroundColor: "#FFE4EE",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 18,
  },

  incomingText: {
    fontSize: 16,

    color: "#888",

    fontWeight: "600",
  },

  callerName: {
    fontSize: 30,

    fontWeight: "900",

    color: "#222",

    marginTop: 6,
  },

  callType: {
    fontSize: 13,

    color: "#E91E63",

    marginTop: 6,
  },

  callActions: {
    flexDirection: "row",

    gap: 18,

    marginTop: 35,
  },

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

  connectedBox: {
    marginTop: 35,

    flexDirection: "row",

    alignItems: "center",

    gap: 10,

    backgroundColor: "#E8F5E9",

    paddingVertical: 14,
    paddingHorizontal: 25,

    borderRadius: 25,
  },

  connectedText: {
    color: "#43A047",

    fontSize: 15,

    fontWeight: "800",
  },
});