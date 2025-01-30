import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const CustomText = ({
  value,
  onChangeText,
  label,
  focusedInput,
  setFocusedInput,
}) => (
  <View>
    <Text style={styles.inputText}>{label}</Text>
    <TextInput
      keyboardType={
        label === "Acquisition Cost:"
          ? "numeric"
          : label === "Number of HDD's"
          ? "numeric"
          : "default"
      }
      style={[
        styles.input,
        focusedInput === label ? styles.inputFocused : null,
      ]}
      value={value}
      onFocus={() => setFocusedInput(label)}
      onBlur={() => setFocusedInput(null)}
      onChangeText={(value) => onChangeText(value)}
    />
  </View>
);





const styles = StyleSheet.create({
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
});
export default CustomText;
