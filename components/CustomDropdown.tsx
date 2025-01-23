import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown"; // Assuming you are using this dropdown library

const CustomDropdown = ({data, label, value, onChange }) => (
  <SafeAreaView>
    <View>
      <Text style={styles.inputText}>{label}</Text>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="id"
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        placeholder=""
        value={value}
        onChange={(item) => onChange(item.id)}
        renderItem={(item) => (
          <View style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  </SafeAreaView>
);
const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 14,
    color: "black",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },
  inputText: {
    fontFamily: "PoppinsSemiBold",
    color: "#00695C",
    fontSize: 14,
  },
});

export default CustomDropdown;
