import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import FeatherIcon from "react-native-vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomDropdown from "@/components/CustomDropdown";
import CustomText from "@/components/CustomText";
import ColorList from "@/components/EquipmentStats";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the back icon

import {
  yearData,
  statusOptions,
  tabs,
  search_tabs,
  hdd_capacity,
  network_type,
  gpu_type,
  wireless_type,
  ram_opts,
} from "./static_data/data";

import axios from "axios";
import EquipmentStats from "@/components/EquipmentStats";
import { useAuth } from "./static_data/AuthContext";
const router = useRouter();

const form_insert = () => {
  const { qrCode } = useLocalSearchParams<{ qrCode: string }>();
  const { id } = useLocalSearchParams<{ qrCode: string }>();
  const { designation } = useLocalSearchParams<{ designation: string }>();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [formData, setFormData] = useState({
    qrCode: qrCode || "",
    equipment_status: "",
    control_id: "",
    item_status: "",
    monitor1Status: "",
    monitor2Status: "",
    ups_status: "",
    division: "",
    user: "",
    control_no: "",
    division_id: "",
    division_title: "",
    acct_person: "",
    actual_user: "",
    employment_title: "",
    actual_employment_type: "",
    work_nature_id: "",
    nature_work_title: "",
    equipment_type: "",
    equipment_title: "",
    property_no: "",
    serial_no: "",
    brand: "",
    model: "",
    year_acquired: "",
    acquisition_cost: "",
    range_category: "",
    range_title: "",
    processor: "",
    specs_net: "",
    specs_gpu: "",
    dedicated_information: "",
    ram_type: "",
    ram_capacity: "",
    no_of_hdd: "",
    no_of_ssd: "",
    hdd_capacity: "",
    ssd_capacity: "",
    wireless_type: "",
    os_installed: "",
    mon_brand_model1: "",
    mon_brand_model2: "",
    monitor1Model: "",
    monitor2Model: "",
    mon_sn1: "",
    mon_sn2: "",
    mon_qr_code1: "",
    mon_qr_code2: "",
    mon_pro_no1: "",
    mon_pro_no2: "",
    mon_acct_user1: "",
    mon_acct_user2: "",
    mon_actual_user1: "",
    mon_actual_user2: "",
    ups_qr_code: "",
    ups_brand: "",
    ups_model: "",
    ups_acct_user: "",
    ups_actual_user: "",
    ups_property_no: "",
    ups_sn: "",
  });

  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [workData, setWorkData] = useState([]);
  const [employmentData, setEmploymentData] = useState([]);
  const [equipmentList, setEquipmentData] = useState([]);
  const [divisionData, setDivisionData] = useState([]);
  const [rangeData, setRangeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const [showMonitor1, setShowMonitor1] = useState(true);
  const [showMonitor2, setShowMonitor2] = useState(false);
  const [showUPS, setShowUPS] = useState(false);

  const toggleSection = (section) => {
    LayoutAnimation.easeInEaseOut();
    if (section === "monitor1") setShowMonitor1(!showMonitor1);
    if (section === "monitor2") setShowMonitor2(!showMonitor2);
    if (section === "ups") setShowUPS(!showUPS);
  };

  useEffect(() => {
    fetchWorkData();
    fetchEquipmentData();
    fetchDivisionData();
    fetchEmployment();
    fetchRangeCategory();
  }, []);

  const fetchWorkData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://riis.denrcalabarzon.com/api/fetchNatureWork"
      );
      setWorkData(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while processing your request.",
        error.response || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEquipmentData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://riis.denrcalabarzon.com/api/fetchEquipment"
      );
      setEquipmentData(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while processing your request.",
        error.response || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDivisionData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://riis.denrcalabarzon.com/api/fetchDivisionData",
        {
          withCredentials: true,
        }
      );
      setDivisionData(response.data);
    } catch (error) {
      alert("Error fetching division data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployment = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://riis.denrcalabarzon.com/api/fetchEmploymentType"
      );
      setEmploymentData(response.data);
    } catch (error) {
      alert("Error fetching employment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRangeCategory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://riis.denrcalabarzon.com/api/fetchRangeEntry"
      );
      setRangeData(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while processing your request.",
        error.response || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const searchUser = async (id) => {
    try {
      setIsLoading(true);
      setError("");

      const url = `https://riis.denrcalabarzon.com/api/fetchNativeAPI?id=${id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (Array.isArray(result) && result.length > 0) {
        const [item] = result;
        // alert(item.ssd_capacity);

        // Find ID from hdd_capacity list
        const matchedCapacity = hdd_capacity.find(
          (cap) =>
            cap.label.trim().toLowerCase() ===
            item.hdd_capacity?.trim().toLowerCase()
        );
        const matchedSSDCapacity = hdd_capacity.find(
          (cap) =>
            cap.label.trim().toLowerCase() ===
            item.ssd_capacity?.trim().toLowerCase()
        );

        setData(result);
        setFormData((prev) => ({
          ...prev,
          ...item,
          hdd_capacity: matchedCapacity ? matchedCapacity.id : "",
          ssd_capacity: matchedSSDCapacity ? matchedSSDCapacity.id : "",
          no_of_hdd: item.no_of_hdd || "",
          no_of_ssd: item.no_of_ssd || "",
          wireless_type: item.wireless_type || "",
          year_acquired: Number(item.year_acquired),
          item_status: item.item_status,
          ram_type: Number(item.ram_type),
        }));
      } else {
        setData([]);
        setError("No data found for the provided ID.");
      }
    } catch (err) {
      Alert.alert(
        "Error",
        "An error occurred while processing your request.",
        error.response || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [val, setTabValue] = useState(search_tabs[0].name);
  const allowedUsernames = [
    "denr4@_rict",
    "penro_laguna",
    "penro_batangas",
    "regional_office",
    "penro_quezon",
    "cenro_lipa",
    "penro_cavite",
    "admin_pmd",
    "penro_rizal",
    "cenro_stacruz",
    "cenro_calaca",
    "cenro_calauag",
    "cenro_catanuan",
    "cenro_tayabas",
    "cenro_real",
    "denr4@_loel",
    "denr4@_ken",
  ];

  const insertData = async () => {
    try {
      setIsLoading(true);
      // Assuming you have a backend API for inserting the data
      const response = await axios.post(
        "https://riis.denrcalabarzon.com/api/insertEquipmentData", // replace with the correct API endpoint
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Check if the insertion was successful
      if (response.status === 200) {
        Alert.alert("Success", "Data has been successfully inserted.");
        // Optionally, you can reset the form data or navigate to another screen after successful submission
        setFormData({}); // Reset the form data or navigate
        router.push("/(tabs)/create"); // Navigate back to the create screen
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      Alert.alert(
        "Error",
        "An error occurred while inserting the data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        {/* <Stack.Screen
          name="About"
          options={{
            title: "DENR IV-A (CALABARZON)",
            headerShown: false,
            headerStyle: { backgroundColor: "#0f766e" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        /> */}

        <View style={styles.placeholder}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/(tabs)/create")}
            >
              <Ionicons name="arrow-back" size={24} color="#00695C" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabs}>
            {search_tabs.map(({ name, icon }, index) => {
              const isActive = name === val;
              return (
                <View
                  key={index}
                  style={[
                    styles.tabWrapper,
                    isActive
                      ? { borderColor: "#00695C", borderBottomWidth: 2 }
                      : {},
                  ]}
                >
                  {" "}
                  <TouchableOpacity onPress={() => setTabValue(name)}>
                    <View style={styles.tab}>
                      <FeatherIcon
                        name={icon}
                        size={30}
                        color={isActive ? "#00695C" : "#6b7280"}
                      />
                      <Text
                        style={[
                          styles.tabText,
                          isActive
                            ? {
                                color: "#00695C",
                                fontFamily: "PoppinsSemiBold",
                              }
                            : {},
                        ]}
                      >
                        {name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : val === "Information" ? (
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <CustomText
                label="QR Code:"
                value={id}
                onChangeText={(value) => handleInputChange("qrCode", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomDropdown
                label="Division:"
                data={divisionData}
                value={formData.division_id}
                onChange={(value) => handleInputChange("division_id", value)}
              />

              <CustomText
                label="Accountable Person:"
                value={formData.acct_person}
                onChangeText={(value) =>
                  handleInputChange("acct_person", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="Actual User:"
                value={formData.actual_user}
                onChangeText={(value) =>
                  handleInputChange("actual_user", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomDropdown
                label="Employment Type:"
                data={employmentData}
                value={formData.actual_employment_type}
                onChange={(value) =>
                  handleInputChange("actual_employment_type", value)
                }
              />

              <CustomDropdown
                label="Nature of Work:"
                data={workData}
                value={formData.actual_employment_type}
                onChange={(value) => handleInputChange("work_nature_id", value)}
              />
              <CustomDropdown
                label="Equipment Type:"
                data={equipmentList}
                value={formData.equipment_type}
                onChange={(value) => handleInputChange("equipment_type", value)}
              />
              <CustomDropdown
                label="Range Category:"
                data={rangeData}
                value={formData.range_category}
                onChange={(value) => handleInputChange("range_category", value)}
              />
              <CustomDropdown
                label="Year Acquired:"
                data={yearData}
                value={formData.year_acquired}
                onChange={(value) => handleInputChange("year_acquired", value)}
              />

              <CustomText
                label="Serial Number:"
                value={formData.serial_no}
                onChangeText={(value) => handleInputChange("serial_no", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="Brand:"
                value={formData.brand}
                onChangeText={(value) => handleInputChange("brand", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />
              <CustomText
                label="Model:"
                value={formData.model}
                onChangeText={(value) => handleInputChange("model", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="Acquisition Cost:"
                value={formData.acquisition_cost}
                onChangeText={(value) =>
                  handleInputChange("acquisition_cost", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomDropdown
                label="Status:"
                data={statusOptions}
                value={formData.item_status}
                onChange={(value) => handleInputChange("item_status", value)}
              />

              <View style={styles.buttonWrapper}>
                {allowedUsernames.includes(user?.username) && (
                  <Text style={styles.buttonText} onPress={insertData}>
                    {" "}
                    {/* Change this to insertData */}
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="save"
                      size={25}
                    />
                    {isLoading ? "Inserting..." : "Save"}{" "}
                    {/* Update the text to show "Inserting..." */}
                  </Text>
                )}
              </View>
            </ScrollView>
          ) : val === "Specification" ? (
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <CustomText
                label="Processor:"
                value={formData.processor}
                onChangeText={(value) => handleInputChange("processor", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomDropdown
                label="Specs (Net):"
                data={network_type}
                value={formData.specs_net}
                onChange={(value) => handleInputChange("specs_net", value)}
              />

              <CustomDropdown
                label="Wireless Type:"
                data={wireless_type}
                value={formData.wireless_type}
                onChange={(value) => handleInputChange("wireless_type", value)}
              />

              <CustomDropdown
                label="Specs (GPU):"
                data={gpu_type}
                value={formData.specs_gpu}
                onChange={(value) => handleInputChange("specs_gpu", value)}
              />

              <CustomText
                label="Dedicated Information:"
                value={formData.dedicated_information}
                onChangeText={(value) =>
                  handleInputChange("dedicated_information", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomDropdown
                label="RAM Type:"
                data={ram_opts}
                value={formData.ram_type}
                onChange={(value) => handleInputChange("ram_type", value)}
              />

              <CustomText
                label="RAM Capacity:"
                value={formData.ram_capacity}
                onChangeText={(value) =>
                  handleInputChange("ram_capacity", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="Number of HDD's:"
                value={formData.no_of_hdd}
                onChangeText={(value) => handleInputChange("no_of_hdd", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />
              <CustomText
                label="Number of SDD's:"
                value={formData.no_of_ssd}
                onChangeText={(value) => handleInputChange("no_of_ssd", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />
              <CustomDropdown
                label="HDD Capacity:"
                data={hdd_capacity}
                value={formData.hdd_capacity}
                onChange={(id) => handleInputChange("hdd_capacity", id)}
              />

              <CustomDropdown
                label="SSD Capacity:"
                data={hdd_capacity}
                value={formData.hdd_capacity}
                onChange={(id) => handleInputChange("hdd_capacity", id)}
              />

              <CustomDropdown
                label="SSD Capacity:"
                data={hdd_capacity}
                value={formData.ssd_capacity}
                onChange={(id) => handleInputChange("ssd_capacity", id)}
              />

              <CustomText
                label="Operating System Installed:"
                value={formData.os_installed}
                onChangeText={(value) =>
                  handleInputChange("os_installed", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />
              <View style={styles.buttonWrapper}>
                {allowedUsernames.includes(user?.username) && (
                  <Text style={styles.buttonText} onPress={insertData}>
                    {" "}
                    {/* Change this to insertData */}
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="save"
                      size={25}
                    />
                    {isLoading ? "Inserting..." : "Save"}{" "}
                    {/* Update the text to show "Inserting..." */}
                  </Text>
                )}
              </View>
            </ScrollView>
          ) : val === "Peripherals" ? (
            <ScrollView contentContainerStyle={{ padding: 15 }}>
              {/* MONITOR 1 */}
              <TouchableOpacity
                style={styles.header}
                onPress={() => toggleSection("monitor1")}
              >
                <Text style={styles.headerText}>📺 Monitor 1</Text>
                <AntDesign name={showMonitor1 ? "up" : "down"} size={20} />
              </TouchableOpacity>
              {showMonitor1 && (
                <View style={styles.section}>
                  {/* Your Monitor 1 fields */}
                  <CustomText
                    label="QR Code"
                    value={formData.mon_qr_code1}
                    onChangeText={(value) =>
                      handleInputChange("mon_qr_code1", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />
                  <CustomText
                    label="Brand (Monitor 1)"
                    value={formData.mon_brand_model1}
                    onChangeText={(v) =>
                      handleInputChange("mon_brand_model1", v)
                    }
                  />
                  <CustomText
                    label="Model (Monitor 1)"
                    value={formData.monitor1Model}
                    onChangeText={(v) => handleInputChange("monitor1Model", v)}
                  />
                  <CustomText
                    label="Serial Number (Monitor 1)"
                    value={formData.mon_sn1}
                    onChangeText={(v) => handleInputChange("mon_sn1", v)}
                  />

                  <CustomText
                    label="Property Number:"
                    value={formData.mon_pro_no1}
                    onChangeText={(value) =>
                      handleInputChange("mon_pro_no1", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />
                  <CustomText
                    label="Accountable Person as seen in PN:"
                    value={formData.mon_acct_user1}
                    onChangeText={(value) =>
                      handleInputChange("mon_acct_user1", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />

                  <CustomText
                    label="Actual User:"
                    value={formData.mon_actual_user1}
                    onChangeText={(value) =>
                      handleInputChange("mon_actual_user1", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />

                  <CustomDropdown
                    label="Status:"
                    data={statusOptions}
                    value={formData.monitor1Status}
                    onChange={(value) =>
                      handleInputChange("monitor1Status", value)
                    }
                  />
                </View>
              )}

              {/* MONITOR 2 */}
              <TouchableOpacity
                style={styles.header}
                onPress={() => toggleSection("monitor2")}
              >
                <Text style={styles.headerText}>📺 Monitor 2</Text>
                <AntDesign name={showMonitor2 ? "up" : "down"} size={20} />
              </TouchableOpacity>
              {showMonitor2 && (
                <View style={styles.section}>
                  {/* Your Monitor 2 fields */}
                  <CustomText
                    label="QR Code"
                    value={formData.mon_qr_code2}
                    onChangeText={(value) =>
                      handleInputChange("mon_qr_code2", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />
                  <CustomText
                    label="Brand (Monitor 2):"
                    value={formData.mon_brand_model2}
                    onChangeText={(value) =>
                      handleInputChange("mon_brand_model2", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />

                  <CustomText
                    label="Model (Monitor 2):"
                    value={formData.monitor2Model}
                    onChangeText={(value) =>
                      handleInputChange("monitor2Model", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />

                  <CustomText
                    label="Serial Number (Monitor 2):"
                    value={formData.mon_sn2}
                    onChangeText={(value) =>
                      handleInputChange("mon_sn2", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />

                  <CustomText
                    label="Property Number:"
                    value={formData.mon_pro_no2}
                    onChangeText={(value) =>
                      handleInputChange("mon_pro_no2", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />
                  <CustomText
                    label="Accountable Person as seen in PN:"
                    value={formData.mon_acct_user2}
                    onChangeText={(value) =>
                      handleInputChange("mon_acct_user2", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />

                  <CustomText
                    label="Actual User:"
                    value={formData.mon_actual_user2}
                    onChangeText={(value) =>
                      handleInputChange("mon_actual_user2", value)
                    }
                    focusedInput={focusedInput}
                    setFocusedInput={setFocusedInput}
                  />
                  <CustomDropdown
                    label="Status:"
                    data={statusOptions}
                    value={formData.monitor2Status}
                    onChange={(value) =>
                      handleInputChange("monitor2Status", value)
                    }
                  />
                </View>
              )}

              {/* Save Button */}
             <View style={styles.buttonWrapper}>
                {allowedUsernames.includes(user?.username) && (
                  <Text style={styles.buttonText} onPress={insertData}>
                    {" "}
                    {/* Change this to insertData */}
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="save"
                      size={25}
                    />
                    {isLoading ? "Inserting..." : "Save"}{" "}
                    {/* Update the text to show "Inserting..." */}
                  </Text>
                )}
              </View>
            </ScrollView>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 14,
    color: "black",
  },
  container: {
    backgroundColor: "white",
    padding: 1,
    flex: 1,
  },
  headerButton: {
    padding: 10,
    marginLeft: 10,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 5,
    position: "relative",
    overflow: "hidden",
  },
  tabWrapper: {
    flex: 1,
    borderColor: "#e5e7eb",
    borderBottomWidth: 2,
    alignItems: "center",
    fontFamily: "PoppinsSemiBold",
  },
  tabText: {
    textAlign: "center",
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  textInputTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 20,
    textAlign: "center",
    color: "#1B5E20",
  },
  placeholder: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 6,
    backgroundColor: "transparent",
  },
  subTitle: {
    marginBottom: 16,
    textAlign: "center",
    fontSize: 19,
    color: "#1B5E20",
    fontFamily: "PoppinsSemiBold",
  },
  inputText: {
    fontFamily: "PoppinsSemiBold",
    color: "#00695C",
    fontSize: 14,
  },
  backButton: {
    padding: 8,
    borderRadius: 6,
  },
  backTitle: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: "#00695C",
  },

  input: {
    height: 50,
    borderColor: "gray",
    fontFamily: "PoppinsRegular",

    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  inputFocused: {
    borderColor: "#B2DFDB",
    borderWidth: 2,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  content: {
    marginTop: 2,
    paddingBottom: 0,
    padding: 20,
  },
  icon: {
    marginRight: 5,
    color: "#fff",
  },
  buttonWrapper: {
    marginTop: 16,
    marginBottom: 50,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
    padding: 12,
    backgroundColor: "#0f766e",
    borderRadius: 8,
    width: "80%",
  },
  header: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 6,
    marginTop: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  section: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default form_insert;
