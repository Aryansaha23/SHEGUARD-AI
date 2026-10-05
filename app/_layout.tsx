import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

const AUTH_KEY = "@sheguard_logged_in";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const auth = await AsyncStorage.getItem(AUTH_KEY);

      if (auth !== "true") {
        router.replace("/login");
      }
    } catch (error) {
      console.log("Auth Check Error:", error);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF7FA",
        }}
      >
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#E91E63",
        tabBarInactiveTintColor: "#777",

        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
      }}
    >
      {/* ================= HOME ================= */}

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* ================= EXPLORE ================= */}

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="compass"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* ================= INDEX - HIDDEN ================= */}

      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      {/* ================= LOGIN - HIDDEN ================= */}

      <Tabs.Screen
        name="login"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      {/* ================= REGISTER - HIDDEN ================= */}

      <Tabs.Screen
        name="register"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      {/* ================= SETTINGS - HIDDEN ================= */}

      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      {/* ================= PROFILE - HIDDEN ================= */}

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}