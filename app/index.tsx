import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const AUTH_KEY = "@sheguard_logged_in";

export default function Index() {
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem(AUTH_KEY);

      if (loggedIn === "true") {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Login Check Error:", error);
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E91E63" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7FA",
  },
});