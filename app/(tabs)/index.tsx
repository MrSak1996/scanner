import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import CustomDropdown from "@/components/CustomDropdown";
import { users_opts } from "./static_data/data";

const App = () => {
  const router = useRouter();
  const isPermissionGranted = true;

  const [userAccounts, setUserAccounts] = useState({
    user: "",
  });

  const handleInputChange = (name, value) => {
    setUserAccounts((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : "height"}
    >
      <Stack.Screen
        options={{
          title: "DENR IV-A (CALABARZON)",
          headerShown: false,
          headerStyle: { backgroundColor: "#0f766e" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <Animated.View
        entering={FadeInUp.delay(200).duration(2000).springify()}
        style={styles.mainContent}
      >
        {/* Background Image */}
        <Image
          style={styles.backgroundImage}
          source={require("../../assets/images/background.jpg")}
        />

      

        {/* Title */}
        <Animated.Text
          entering={FadeInUp.delay(1000).duration(1000).springify()}
          style={styles.title}
        >
          Welcome to CodeTrack
        </Animated.Text>

        {/* Buttons Section */}
        <Animated.View
          entering={FadeInUp.delay(1000).duration(2000).springify()}
          style={styles.buttonSection}
        >
          {/* Dropdown */}
       

          {/* Scan QR Code Button */}
          <TouchableOpacity
            onPress={() => {
              if (isPermissionGranted) {
                router.push("/(tabs)/scanner");
              }
            }}
            disabled={!isPermissionGranted}
            style={[
              styles.button,
              { opacity: !isPermissionGranted ? 0.5 : 1 },
            ]}
          >
            <Text style={styles.buttonText}>Scan QR Code</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>All Rights Reserved 2025</Text>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>Developed by: RICT-PMD</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  logo: {
  
    height: 300,
    width: 300,
    bottom: 50,
    opacity:0.1
  },
  title: {
    fontFamily: "PoppinsRegular",
    color: "#1B5E20",
    fontSize: 32,
    position: "absolute",
    top:390,
  },
  buttonSection: {
    width: "100%",
    paddingHorizontal: 85,
    position: "absolute",
    bottom: 80,
  },
  dropdownContainer: {
    marginBottom: 250,
  },
  button: {
    backgroundColor: "#00695C",
    borderRadius: 20,
    paddingVertical: 15,
    bottom:300
  },
  buttonText: {
    fontFamily: "PoppinsLight",
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    color: "#3645aa",
    textAlign: "center",
  },
});
