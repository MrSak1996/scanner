import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  Modal,
} from "react-native";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "./static_data/AuthContext";

const API_BASE_URL = "https://riis.denrcalabarzon.com/api";

export default function Create() {
  const router = useRouter();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [status, setStatus] = React.useState(false);

  const [stats, setStats] = useState([
    {
      title: "Total ICT Equipment",
      total: 0,
      icon: "laptop",
      api: `/vw-gen-info?designation=${user?.roles}`,
    },
    {
      title: "Total Serviceable Equipment",
      total: 0,
      icon: "tool",
      api: `/getCountStatus?designation=${user?.roles}`,
    },
    {
      title: "Total Unserviceable Equipment",
      total: 0,
      icon: "closecircleo",
      api: `/getCountStatus?designation=${user?.roles}`,
    },
    {
      title: "Total Outdated Equipment",
      total: 0,
      icon: "hourglass",
      api: `/getOutdatedEquipment?designation=${user?.roles}`,
    },
    {
      title: "Total Incomplete Data",
      total: 0,
      icon: "exclamationcircleo",
      api: `/vw-invalid-data?designation=${user?.roles}`,
    },
  ]);

  const [incomeData, setIncomeData] = useState([
    { title: "Monthly Salary", amount: "$10,086.50", percentage: 50 },
    { title: "Passive Income", amount: "$3,631.14", percentage: 18 },
    { title: "Freelance", amount: "$3,429.41", percentage: 17 },
    { title: "Side Business", amount: "$3,025.95", percentage: 15 },
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
      setSearchResults(response.data.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleEdit = (item) => {
    setModalVisible(false);
    setTimeout(() => {
      router.push({
        pathname: "/(tabs)/search",
        params: { id: item.qr_code },
      });
    }, 300);
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
              return { ...item, total: data[0]?.total || 0 };
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
              return { ...item, total: data[0]?.total || 0 };
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
    <View style={styles.container}>
      {/* Half green / half black banner */}
      <View style={styles.topBanner}>
        {" "}
        <Image
          style={styles.bannerLogo}
          source={require("../../assets/images/denr_logo.png")}
          resizeMode="contain"
        />{" "}
        <Text style={styles.topBannerText}>
          {" "}
          Department of Environment and Natural Resources{"\n"}REGION IV-A
          (CALABARZON){" "}
        </Text>{" "}
      </View>

      {/* Header */}

      <Text style={styles.header}>
        <Ionicons name="home" size={26} color="#1A237E" />
        Dashboard
      </Text>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#999"
          style={[styles.searchInput, { flex: 1 }]} // take available space
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={{
            backgroundColor: "#4CAF50",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 6,
            marginLeft: 6,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Go</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
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
                        <Text style={{ fontWeight: "600" }}>QR Code:</Text>{" "}
                        {item.qr_code || "N/A"}
                      </Text>
                      <Text style={{ color: "#555", marginBottom: 4 }}>
                        <Text style={{ fontWeight: "600" }}>
                          Primary Monitor Code:
                        </Text>{" "}
                        {item.mon_qr_code1 || "N/A"}
                      </Text>
                      <Text style={{ color: "#555", marginBottom: 4 }}>
                        <Text style={{ fontWeight: "600" }}>
                          Secondary Monitor Code:
                        </Text>{" "}
                        {item.mon_qr_code2 || "N/A"}
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
                        onPress={() => handleEdit(item)} // use your actual function
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
        <View style={styles.row}>
          <View style={styles.largeCard}>
            <Text style={styles.cardTitle}>Total ICT Equipment</Text>
            <Text style={styles.cardValue}>
              {stats[0].total} <Text style={styles.cardSub}>| units</Text>
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "97%" }]} />
            </View>
          </View>

          <View style={styles.largeCard}>
            <Text style={styles.cardTitle}>Total Serviceable Equipment</Text>
            <Text style={styles.cardValue}>
              {stats[1].total} <Text style={styles.cardSub}>| units</Text>
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "97%" }]} />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Ionicons name="trash-sharp" size={28} color="#4da6ff" />
            <Text style={styles.cardLabel}>Unserviceable</Text>
            <Text style={styles.cardCount}>{stats[2].total}</Text>
          </View>

          <View style={styles.smallCard}>
            <Ionicons name="calendar-sharp" size={28} color="#a64dff" />
            <Text style={styles.cardLabel}>Outdated</Text>
            <Text style={styles.cardCount}>{stats[3].total}</Text>
          </View>

          <View style={styles.smallCard}>
            <Ionicons name="construct-outline" size={28} color="#ff8533" />
            <Text style={styles.cardLabel}>Incomplete</Text>
            <Text style={styles.cardCount}>{stats[4].total}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Ionicons name="desktop-sharp" size={28} color="#004D40" />
            <Text style={styles.cardLabel}>Desktops</Text>
            <Text style={styles.cardCount}>9</Text>
          </View>
          <View style={styles.smallCard}>
            <Ionicons name="laptop-outline" size={28} color="#00cc99" />
            <Text style={styles.cardLabel}>Laptops</Text>
            <Text style={styles.cardCount}>11</Text>
          </View>
          <View style={styles.smallCard}>
            <Ionicons name="print-outline" size={28} color="#996633" />
            <Text style={styles.cardLabel}>Printers</Text>
            <Text style={styles.cardCount}>0</Text>
          </View>
        </View>

      
        
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: "#28a745" }]}
          onPress={() => router.push("./scanner")}
        >
          <Ionicons name="qr-code-outline" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
        style={[styles.fab, { backgroundColor: "#ff9800" }]}
          onPress={() => router.push("./form_insert")}
        
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, marginTop: 0 },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 10,
    marginTop: 30,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CFD8DC",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchInput: { flex: 1, padding: 15, color: "#000" },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  largeCard: {
    backgroundColor: "#CFD8DC",
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  cardTitle: { color: "#1A237E", fontSize: 14 },
  cardValue: { color: "#1A237E", fontSize: 18, fontWeight: "bold" },
  cardSub: { color: "#777", fontSize: 14 },
  progressBar: {
    height: 6,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginTop: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#1A237E",
    borderRadius: 5,
  },
  smallCard: {
    backgroundColor: "#CFD8DC",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 4,
    minWidth: 100,
  },
  cardLabel: {
    color: "#1A237E",
    marginTop: 6,
    fontSize: 14,
    textAlign: "center",
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  cardCount: { color: "#777", fontSize: 12 },
  fabContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  fab: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 50,
    elevation: 5,
    marginTop: 10,
  },
  topBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignSelf: "center",
    marginBottom: 12,
    marginTop: -16,
    maxWidth: "95%",
    shadowColor: "#000",
    backgroundColor: "#4CAF50", // solid green or replace with gradient later
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  topBannerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    flexShrink: 1,
    marginTop: 15,
  },
});
