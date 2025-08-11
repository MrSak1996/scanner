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
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import FeatherIcon from "react-native-vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomDropdown from "@/components/CustomDropdown";
import CustomText from "@/components/CustomText";
import ColorList from "@/components/EquipmentStats";

import {
  yearData,
  statusOptions,
  tabs,
  network_type,
  gpu_type,
  wireless_type,
  ram_opts,
} from "./static_data/data";

import axios from "axios";
import EquipmentStats from "@/components/EquipmentStats";
import { useAuth } from "./static_data/AuthContext";

const Create = () => {
  const { qrCode } = useLocalSearchParams<{ qrCode: string }>();
  const { id } = useLocalSearchParams<{ qrCode: string }>();
  const { designation } = useLocalSearchParams<{ designation: string }>();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [formData, setFormData] = useState({
    qrCode: qrCode || "",
    equipment_status: "",
    control_id: "",
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
    hdd_capacity: "",
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
    monitor1Status: "",
    monitor2Status: "",
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

  useEffect(() => {
    qrCode && searchUser(qrCode);
  }, [qrCode]);


  useEffect(() => {
    console.log(id.equipment_title)
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

      if (!response.ok) {
        throw new Error(
          `Server returned an error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (Array.isArray(result) && result.length > 0) {
        const [item] = result;
        setData(result);

        setFormData((prev) => ({
          ...prev,
          ...item,
          hdd_capacity: item.hdd_capacity || "",
          wireless_type: item.wireless_type || "",
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

  const updateUser = async () => {
    try {
      setIsLoading(true);
      const url = "https://riis.denrcalabarzon.com/api/updateUser";
      const response = await axios.post(url, formData);

      if (response.status === 200) {
        Alert.alert(
          "Success",
          response.data.message || "User updated successfully."
        );
      } else {
        Alert.alert("Error", "Unexpected response from the server.");
      }
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

  const updatePeripherals = async () => {
    try {
      setIsLoading(true);
      const url = "https://riis.denrcalabarzon.com/api/updatePeripherals";
      const response = await axios.post(url, formData);

      if (response.status === 200) {
        Alert.alert(
          "Success",
          response.data.message || "Updated successfully."
        );
      } else {
        Alert.alert("Error", "Unexpected response from the server.");
      }
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

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [val, setTabValue] = useState(tabs[1].name);
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

  <View style={styles.buttonWrapper}>
    {allowedUsernames.includes(user?.username) && (
      <Text style={styles.buttonText} onPress={updateUser}>
        <AntDesign
          style={styles.icon}
          color={isFocus ? "blue" : "black"}
          name="save"
          size={25}
        />
        {isLoading ? "Updating..." : user?.username}
      </Text>
    )}
  </View>;

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
          <View style={styles.tabs}>
            {tabs.map(({ name, icon }, index) => {
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
          ) : val === "Dashboard" ? (
            <EquipmentStats color="#08254b" />
          ) : val === "Information" ? (
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <CustomText
                label="QR Code:"
                value={qrCode}
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
                value={formData.equipment_status}
                onChange={(value) =>
                  handleInputChange("equipment_status", value)
                }
              />

              <View style={styles.buttonWrapper}>
                {allowedUsernames.includes(user?.username) && (
                  <Text style={styles.buttonText} onPress={updateUser}>
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="save"
                      size={25}
                    />
                    {isLoading ? "Updating..." : "Update"}
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
                label="HDD Capacity:"
                value={formData.hdd_capacity}
                onChangeText={(value) =>
                  handleInputChange("hdd_capacity", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
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
                {user?.email === "kimsacluti10101996@gmail.com" ? (
                  <Text style={styles.buttonText} onPress={updateUser}>
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="save"
                      size={25}
                    />
                    {isLoading ? "Updating..." : "Update"}
                  </Text>
                ) : null}
              </View>
            </ScrollView>
          ) : val === "Peripherals" ? (
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <CustomText
                label="Brand (Monitor 1):"
                value={formData.mon_brand_model1}
                onChangeText={(value) =>
                  handleInputChange("mon_brand_model1", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="Model (Monitor 1):"
                value={formData.monitor1Model}
                onChangeText={(value) =>
                  handleInputChange("monitor1Model", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />
              <CustomText
                label="Serial Number (Monitor 1):"
                value={formData.mon_sn1}
                onChangeText={(value) => handleInputChange("mon_sn1", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

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
                onChangeText={(value) => handleInputChange("mon_sn2", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

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
              <CustomText
                label="Accountable Person as seen in PN (UPS)"
                value={formData.ups_acct_user}
                onChangeText={(value) =>
                  handleInputChange("ups_acct_user", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="Accountable User:"
                value={formData.ups_actual_user}
                onChangeText={(value) =>
                  handleInputChange("ups_actual_user", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="QR Code:"
                value={formData.ups_qr_code}
                onChangeText={(value) =>
                  handleInputChange("ups_qr_code", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="Property Number:"
                value={formData.ups_property_no}
                onChangeText={(value) =>
                  handleInputChange("ups_property_no", value)
                }
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="Serial Number:"
                value={formData.ups_sn}
                onChangeText={(value) => handleInputChange("ups_sn", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="Brand:"
                value={formData.ups_brand}
                onChangeText={(value) => handleInputChange("ups_brand", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />

              <CustomText
                label="Model:"
                value={formData.ups_model}
                onChangeText={(value) => handleInputChange("ups_model", value)}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
              />
              <View style={styles.buttonWrapper}>
                {user?.roles == 13 ? (
                  <Text style={styles.buttonText} onPress={updatePeripherals}>
                    <AntDesign
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="save"
                      size={25}
                    />
                    {isLoading ? "Updating..." : "Update"}
                  </Text>
                ) : null}
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
});

export default Create;
