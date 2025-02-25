import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../app/(tabs)/static_data/AuthContext";

const API_BASE_URL = "https://7ae2-180-232-3-92.ngrok-free.app/api";

const EquipmentStats = ({ color }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [stats, setStats] = useState([
    {
      title: "Total ICT Equipment",
      opacity: 1.5,
      total: 0,
      icon: "laptop",
      api: `/vw-gen-info?designation=${user?.roles}`,
    },
    {
      title: "Total Serviceable Equipment",
      opacity: 0.8,
      total: 0,
      icon: "tool",
      api: `/getCountStatus?designation=${user?.roles}`,
    },
    {
      title: "Total Unserviceable Equipment",
      opacity: 0.7,
      total: 0,
      icon: "closecircleo",
      api: `/getCountStatus?designation=${user?.roles}`,
    },
    {
      title: "Total Outdated Equipment",
      opacity: 0.6,
      total: 0,
      icon: "hourglass",
      api: `/getOutdatedEquipment?designation=${user?.roles}`,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedStats = await Promise.all(
          stats.map(async (item) => {
            const response = await fetch(`${API_BASE_URL}${item.api}`);
            const data = await response.json();
            if (item.api.includes("vw-gen-info")) {
              return { ...item, total: data.total };
            }
            if (item.api.includes("getOutdatedEquipment")) {
              return { ...item, total: data.length > 0 ? data[0].total || 0 : 0 };
            }
            if (item.api.includes("getCountStatus")) {
              return { ...item, total: item.title.includes("Serviceable") ? data[0]?.serviceable || 0 : 0 };
            }
            return { ...item, total: data.total || 0 };
          })
        );
        setStats(updatedStats);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image style={styles.img} source={require("../assets/images/denr_logo.png")} />
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#08254b" style={{ marginTop: 20 }} />
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          {stats.map((item, index) => (
            <View key={index} style={[styles.card, { backgroundColor: hexToRgba(color, item.opacity) }]}>
              <View style={styles.iconContainer}>
                <AntDesign name={item.icon} size={35} color="#ffffff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.total}>{item.total}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      )}

      <TouchableOpacity onPress={() => router.push("/(tabs)/scanner")} style={styles.button}>
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Utility function to convert HEX to RGBA
const hexToRgba = (hex, opacity) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  img: {
    width: 60,
    height: 60,
  },
  userInfo: {
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 18,
    color: "#555",
    fontWeight: "400",
    fontFamily: "PoppinsRegular",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "PoppinsBold",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffffff22",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 5,
    fontFamily: "PoppinsLight",
  },
  total: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    fontFamily: "PoppinsLight",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#0f766e",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EquipmentStats;
