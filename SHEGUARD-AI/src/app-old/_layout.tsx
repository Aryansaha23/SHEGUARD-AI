import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
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
      {/* ==========================================
          ONLY MAIN HOME
          ========================================== */}

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

      {/* ==========================================
          EXPLORE
          ========================================== */}

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

      {/* ==========================================
          HIDDEN ROUTES
          ========================================== */}

      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="register"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}