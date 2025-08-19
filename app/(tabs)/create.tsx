import React, { useEffect, useMemo, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "./static_data/AuthContext";

const API_BASE_URL = "https://riis.denrcalabarzon.com/api";

export default function Create() {
  const router = useRouter();
  const { user } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Normalize designation once user is loaded
  const designation = useMemo(() => {
    if (!user || user.roles == null) return "";
    return Array.isArray(user.roles) ? encodeURIComponent(user.roles.join(",")) : encodeURIComponent(String(user.roles));
  }, [user]);

  // Build stats *after* we know designation, so endpoints are valid
  const statsTemplate = useMemo(
    () => [
      {
        key: "total_equipment",
        title: "Total ICT Equipment",
        total: 0,
        api: `/vw-gen-info?designation=${designation}`,
      },
      {
        key: "serviceable",
        title: "Total Serviceable Equipment",
        total: 0,
        api: `/getCountStatus?designation=${designation}`,
      },
      {
        key: "unserviceable",
        title: "Total Unserviceable Equipment",
        total: 0,
        api: `/getCountStatus?designation=${designation}`,
      },
      {
        key: "outdated",
        title: "Total Outdated Equipment",
        total: 0,
        api: `/getOutdatedEquipment?designation=${designation}`,
      },
      {
        key: "incomplete",
        title: "Total Incomplete Data",
        total: 0,
        api: `/vw-invalid-data?designation=${designation}`,
      },
    ],
    [designation]
  );

  const [stats, setStats] = useState(statsTemplate);

  // Keep local stats in sync whenever template changes (e.g., when user loads)
  useEffect(() => {
    setStats(statsTemplate);
  }, [statsTemplate]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const url = `${API_BASE_URL}/vw-gen-info?designation=${designation}&search=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(url);
      setSearchResults(response.data?.data ?? []);
      setModalVisible(true);
    } catch (error) {
      console.error("Search error:", error?.response?.data || error.message);
    } finally {
      setSearching(false);
    }
  };

  const handleEdit = (item) => {
    setModalVisible(false);
    setTimeout(() => {
      router.push({ pathname: "/(tabs)/search", params: { id: item.qr_code } });
    }, 300);
  };

  useEffect(() => {
    // Wait until we know the user's designation to avoid hitting ...designation=undefined
    if (!designation) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const updatedStats = await Promise.all(
          statsTemplate.map(async (item) => {
            const url = `${API_BASE_URL}${item.api}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Request failed (${res.status}) for ${url}`);
            const data = await res.json();

            if (item.api.includes("vw-gen-info")) {
              console.log(data.total)
              return { ...item, total: data?.total ?? 0 };
            }

            if (item.api.includes("getOutdatedEquipment")) {
              // API seems to return an array; guard it
              return { ...item, total: Array.isArray(data) ? (data[0]?.total ?? 0) : (data?.total ?? 0) };
            }

            if (item.api.includes("getCountStatus")) {
              // Expecting something like [{ serviceable: n, unserviceable: m }]
              const serviceable = Array.isArray(data) ? (data[0]?.serviceable ?? 0) : (data?.serviceable ?? 0);
              const unserviceable = Array.isArray(data) ? (data[0]?.unserviceable ?? 0) : (data?.unserviceable ?? 0);
              const total = item.key === "unserviceable" ? unserviceable : serviceable;
              return { ...item, total };
            }

            // Fallback
            return { ...item, total: data?.total ?? 0 };
          })
        );

        setStats(updatedStats);
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
      } catch (error) {
        console.error("Error fetching data:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [designation, fadeAnim, statsTemplate]);

  return (
    <View style={styles.container}>
      {/* Top banner */}
      <View style={styles.topBanner}>
        <Image style={styles.bannerLogo} source={require("../../assets/images/denr_logo.png")} resizeMode="contain" />
        <Text style={styles.topBannerText}>
          Department of Environment and Natural Resources{"\n"}REGION IV-A (CALABARZON)
        </Text>
      </View>

      {/* Header */}
      <Text style={styles.header}>
        <Ionicons name="home" size={26} color="#1A237E" /> Dashboard
      </Text>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#999"
          style={[styles.searchInput, { flex: 1 }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>{searching ? "..." : "Go"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Results modal */}
        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Search Results</Text>
              <ScrollView>
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <View key={idx} style={styles.resultCard}>
                      <Text style={styles.resultTitle}>{item.equipment_title || "No Name"}</Text>
                      <Text style={styles.resultText}><Text style={styles.resultLabel}>QR Code:</Text> {item.qr_code || "N/A"}</Text>
                      <Text style={styles.resultText}><Text style={styles.resultLabel}>Primary Monitor Code:</Text> {item.mon_qr_code1 || "N/A"}</Text>
                      <Text style={styles.resultText}><Text style={styles.resultLabel}>Secondary Monitor Code:</Text> {item.mon_qr_code2 || "N/A"}</Text>
                      <Text style={styles.resultText}><Text style={styles.resultLabel}>Serial No:</Text> {item.serial_no || "N/A"}</Text>
                      <Text style={styles.resultText}><Text style={styles.resultLabel}>Property No:</Text> {item.property_no || "N/A"}</Text>
                      <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                        <Text style={styles.editBtnText}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={{ textAlign: "center", color: "#666" }}>No results found</Text>
                )}
              </ScrollView>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Stats rows */}
        <View style={styles.row}>
          <View style={styles.largeCard}>
            <Text style={styles.cardTitle}>Total ICT Equipment</Text>
            <Text style={styles.cardValue}>
              {stats[0]?.total ?? 0} <Text style={styles.cardSub}>| units</Text>
            </Text>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: "97%" }]} /></View>
          </View>

          <View style={styles.largeCard}>
            <Text style={styles.cardTitle}>Total Serviceable Equipment</Text>
            <Text style={styles.cardValue}>
              {stats[1]?.total ?? 0} <Text style={styles.cardSub}>| units</Text>
            </Text>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: "97%" }]} /></View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Ionicons name="trash-sharp" size={28} color="#4da6ff" />
            <Text style={styles.cardLabel}>Unserviceable</Text>
            <Text style={styles.cardCount}>{stats[2]?.total ?? 0}</Text>
          </View>

          <View style={styles.smallCard}>
            <Ionicons name="calendar-sharp" size={28} color="#a64dff" />
            <Text style={styles.cardLabel}>Outdated</Text>
            <Text style={styles.cardCount}>{stats[3]?.total ?? 0}</Text>
          </View>

          <View style={styles.smallCard}>
            <Ionicons name="construct-outline" size={28} color="#ff8533" />
            <Text style={styles.cardLabel}>Incomplete</Text>
            <Text style={styles.cardCount}>{stats[4]?.total ?? 0}</Text>
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

      {/* FABs */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fab, { backgroundColor: "#28a745" }]} onPress={() => router.push("./scanner")}>
          <Ionicons name="qr-code-outline" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, { backgroundColor: "#ff9800" }]} onPress={() => router.push("./form_insert")}>
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && (
        <Animated.View style={{ opacity: fadeAnim }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, marginTop: 0 },
  header: { fontSize: 28, fontWeight: "bold", color: "#1A237E", marginBottom: 10, marginTop: 30 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#CFD8DC", borderRadius: 8, paddingHorizontal: 10, marginBottom: 16 },
  searchInput: { flex: 1, padding: 15, color: "#000" },
  row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 12 },
  largeCard: { backgroundColor: "#CFD8DC", flex: 1, padding: 12, borderRadius: 10, marginHorizontal: 4 },
  cardTitle: { color: "#1A237E", fontSize: 14 },
  cardValue: { color: "#1A237E", fontSize: 50, fontWeight: "bold" },
  cardSub: { color: "#777", fontSize: 14 },
  progressBar: { height: 6, backgroundColor: "#fff", borderRadius: 5, marginTop: 8 },
  progressFill: { height: 6, backgroundColor: "#1A237E", borderRadius: 5 },
  smallCard: { backgroundColor: "#CFD8DC", flex: 1, alignItems: "center", justifyContent: "center", padding: 12, borderRadius: 10, marginHorizontal: 4, minWidth: 100 },
  cardLabel: { color: "#1A237E", marginTop: 6, fontSize: 14, textAlign: "center", flexWrap: "wrap", maxWidth: "100%" },
  cardCount: { color: "#777", fontSize: 12 },
  fabContainer: { position: "absolute", bottom: 20, right: 20, flexDirection: "column", alignItems: "center" },
  fab: { backgroundColor: "#007bff", padding: 16, borderRadius: 50, elevation: 5, marginTop: 10 },
  topBanner: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, alignSelf: "center", marginBottom: 12, marginTop: -16, maxWidth: "95%", shadowColor: "#000", backgroundColor: "#4CAF50", shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  bannerLogo: { width: 50, height: 50, marginRight: 10 },
  topBannerText: { color: "#fff", fontSize: 14, fontWeight: "bold", flexShrink: 1, marginTop: 15 },
  searchBtn: { backgroundColor: "#4CAF50", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginLeft: 6 },
  searchBtnText: { color: "#fff", fontWeight: "bold" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalCard: { backgroundColor: "#fff", borderRadius: 10, padding: 20, width: "90%", maxHeight: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  resultCard: { backgroundColor: "#e6f4f1", padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#b2dfdb", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  resultTitle: { fontSize: 18, fontWeight: "bold", color: "#004d40", marginBottom: 8 },
  resultText: { color: "#555", marginBottom: 4 },
  resultLabel: { fontWeight: "600" },
  editBtn: { backgroundColor: "#607D8B", paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  editBtnText: { color: "#fff", fontWeight: "bold" },
  closeBtn: { backgroundColor: "#0f766e", paddingVertical: 12, borderRadius: 8, marginTop: 10 },
  closeBtnText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
});
