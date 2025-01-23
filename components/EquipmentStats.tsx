import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const EquipmentStats = ({ color }) => {
  const stats = [
    {
      title: "Total ICT Equipment",
      opacity: 1.5,
      total: 0,
      icon: "laptop", // AntDesign icon name
    },
    {
      title: "Total Serviceable Equipment",
      opacity: 0.9,
      total: 0,
      icon: "tool",
    },
    {
      title: "Total Unserviceable Equipment",
      opacity: 0.9,
      total: 0,
      icon: "closecircleo",
    },
    {
      title: "Total Outdated Equipment",
      opacity: 0.9,
      total: 0,
      icon: "hourglass",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {stats.map((item, index) => (
        <View
          key={index}
          style={[
            styles.card,
            { backgroundColor: hexToRgba(color, item.opacity) }, // Apply dynamic opacity to the provided color
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
      ))}
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
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    borderColor: "#0891b2",
  },
  iconContainer: {
    marginRight: 15, // Space between icon and text
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff", // White text for better contrast
    marginBottom: 10,
    fontFamily: "PoppinsLight",
  },
  percentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff", // White text for better contrast
    marginBottom: 5,
    fontFamily: "PoppinsLight",
  },
  total: {
    fontSize: 16,
    color: "#ffffff", // White text for better contrast
    fontFamily: "PoppinsLight",
  },
});

export default EquipmentStats;
