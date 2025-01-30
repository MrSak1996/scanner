import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";

const API_BASE_URL = "https://b9a0-180-232-3-93.ngrok-free.app/api";

const EquipmentStats = ({ color }) => {
    const router = useRouter();
  
  const [stats, setStats] = useState([
    {
      title: "Total ICT Equipment",
      opacity: 1.5,
      total: 0,
      icon: "laptop",
      api: "/getInventoryData",
    },
    {
      title: "Total Serviceable Equipment",
      opacity: 0.9,
      total: 0,
      icon: "tool",
      api: "/getCountStatus",
    },
    {
      title: "Total Unserviceable Equipment",
      opacity: 0.9,
      total: 0,
      icon: "closecircleo",
      api: "/getCountStatus",
    },
    {
      title: "Total Outdated Equipment",
      opacity: 0.9,
      total: 0,
      icon: "hourglass",
      api: "/getOutdatedEquipment",
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedStats = await Promise.all(
          stats.map(async (item) => {
            const response = await fetch(`${API_BASE_URL}${item.api}`);
            const data = await response.json();

            // Special handling for getCountStatus response
            if (item.api === "/getCountStatus") {
              if (item.title.includes("Serviceable")) {
                return { ...item, total: data.serviceable_count || 0 };
              } else if (item.title.includes("Unserviceable")) {
                return { ...item, total: data.unserviceable_count || 0 };
              }
            }

            return { ...item, total: data.total || 0 }; // Default case
          })
        );
        setStats(updatedStats);
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
      {loading ? (
        <ActivityIndicator size="large" color="#0891b2" />
      ) : (
        stats.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: hexToRgba(color, item.opacity) },
            ]}
          >
            <View style={styles.iconContainer}>
              <AntDesign name={item.icon} size={30} color="#ffffff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.total}>Total: {item.total}</Text>
            </View>
           
          </View>
        ))
      )}
       <TouchableOpacity
            onPress={() => {
                router.push("/(tabs)/scanner");
              
            }}
            style={[
              styles.button,
            ]}
            className="bg-blue-500"
          >
            <Text style={styles.buttonText}>Scan QR Code</Text>
          </TouchableOpacity>
    </ScrollView>
  );
};

// Utility function to convert HEX color to RGBA
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
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    borderColor: "#0891b2",
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 10,
    fontFamily: "PoppinsLight",
  },
  total: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "PoppinsLight",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#263238",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EquipmentStats;
