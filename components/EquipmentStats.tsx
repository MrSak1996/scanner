import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
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
import { Modal } from "react-native";
import axios from "axios";

const API_BASE_URL = "https://riis.denrcalabarzon.com/api";

const EquipmentStats = ({ color }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

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
    {
      title: "Total Incomplete Data",
      opacity: 0.6,
      total: 0,
      icon: "hourglass",
      api: `/vw-invalid-data?designation=${user?.roles}`,
    },
  ]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const response = await axios.get(
        `${API_BASE_URL}/vw-gen-info?designation=${
          user?.roles
        }&search=${encodeURIComponent(searchQuery)}`
      );
      const data = response.data.data;
      setSearchResults(data);

      console.log(data.equipment_title);
      setModalVisible(true); // show modal after results
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleEdit = (item) => {
    try {
      router.push({
        pathname: "../(tabs)/create",
        params: { id: item }, // example param
      });
      setModalVisible(false);
    } catch (error) {
      console.log("this"+error);
    }
  };

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
              return {
                ...item,
                total: data.length > 0 ? data[0].total || 0 : 0,
              };
            }
            if (item.api.includes("getCountStatus")) {
              return {
                ...item,
                total: item.title.includes("Serviceable")
                  ? data[0]?.serviceable || 0
                  : data[0]?.unserviceable || 0,
              };
            }
            if (item.api.includes("Incomplete")) {
              return {
                ...item,
                total: data.length > 0 ? data[0].total || 0 : 0,
              };
            }
            return { ...item, total: data.count || 0 };
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
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              width: "90%",
              maxHeight: "80%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Search Results
            </Text>

            <ScrollView>
              {searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#e6f4f1", // soft green background
                      padding: 15,
                      borderRadius: 12,
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor: "#b2dfdb", // light teal border
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#004d40", // deep green
                        marginBottom: 8,
                      }}
                    >
                      {item.equipment_title || "No Name"}
                    </Text>

                    <Text style={{ color: "#555", marginBottom: 4 }}>
                      <Text style={{ fontWeight: "600" }}>ID:</Text>{" "}
                      {item.qr_code || "N/A"}
                    </Text>
                    <Text style={{ color: "#555", marginBottom: 4 }}>
                      <Text style={{ fontWeight: "600" }}>Serial No:</Text>{" "}
                      {item.serial_no || "N/A"}
                    </Text>
                    <Text style={{ color: "#555", marginBottom: 8 }}>
                      <Text style={{ fontWeight: "600" }}>Property No:</Text>{" "}
                      {item.property_no || "N/A"}
                    </Text>

                    {/* Edit Button */}
                    <TouchableOpacity
                      onPress={() => handleEdit(item)} // pass the item to edit
                      style={{
                        backgroundColor: "#607D8B",
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: "center", color: "#666" }}>
                  No results found
                </Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={{
                backgroundColor: "#0f766e",
                paddingVertical: 12,
                borderRadius: 8,
                marginTop: 10,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Image
          style={styles.img}
          source={require("../assets/images/denr_logo.png")}
        />
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)/scanner")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setSearchVisible(!searchVisible)}
      >
        <Text style={styles.buttonText}>
          {searchVisible ? "Hide Search" : "Search"}
        </Text>
      </TouchableOpacity>

      {searchVisible && (
        <View style={{ width: "100%", marginBottom: 10 }}>
          <TextInput
            placeholder="Enter equipment name or ID"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={handleSearch}
          >
            <Text style={styles.buttonText}>Search Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#08254b"
          style={{ marginTop: 20 }}
        />
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          {stats.map((item, index) => (
            <View
              key={index}
              style={[
                styles.card,
                { backgroundColor: hexToRgba(color, item.opacity) },
              ]}
            >
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
    </ScrollView>
  );
};

const hexToRgba = (hex, opacity) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 50,
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
    marginBottom: 10,
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
    marginVertical: 5,
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
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 10,
  },
});

export default EquipmentStats;
