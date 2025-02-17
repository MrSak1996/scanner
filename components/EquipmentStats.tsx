import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../app/(tabs)/static_data/AuthContext";

const API_BASE_URL = "https://d98c-180-232-3-94.ngrok-free.app/api";

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

  useEffect(() => {
    const fetchData = async () => {

      try {
        const updatedStats = await Promise.all(
          stats.map(async (item) => {
            const response = await fetch(`${API_BASE_URL}${item.api}`);

            const data = await response.json();
            if (item.api === `/vw-gen-info?designation=${user?.roles}`) {
              console.log(data.total)
              return { ...item, total:  data.total };
            }
            
            if (item.api === `/getOutdatedEquipment?designation=${user?.roles}`) {
              return { ...item, total: (Array.isArray(data) && data.length > 0) ? data[0].total || 0 : 0 };
            }

            if (item.api === `/getCountStatus?designation=${user?.roles}`) {
              const defaultData = { serviceable: 0, unserviceable: 0 };
              const result = data?.length > 0 ? data[0] : defaultData;
            
              if (item.title.includes("Serviceable")) {
                return { ...item, total: result.serviceable };
              } else if (item.title.includes("Unserviceable")) {
                return { ...item, total: 0 };
              }
            }
            

            return { ...item, total: data.total || 0 };
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
              <Text style={styles.total}>{item.total}</Text>
            </View>
          </View>
        ))
      )}
      <TouchableOpacity
        onPress={() => {
          router.push("/(tabs)/scanner");
        }}
        style={[styles.button]}
        
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
    fontSize: 36,
    color: "#ffffff",
    fontFamily: "PoppinsLight",
  },
  button: {
    width: "100%",
    height: 50,
    top:20,
    backgroundColor: "#2e4156",
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
