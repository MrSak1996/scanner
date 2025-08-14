import React, { useRef, useEffect, useState } from "react";
import {
  AppState,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Camera, useCameraPermissions, CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { Overlay } from "../Overlay"; // Ensure this file exists
import axios from "axios";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the back icon
import { useIsFocused } from "@react-navigation/native";

export default function Home() {
  const isFocused = useIsFocused();

  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBarcodeScanned = async ({ data }) => {
    if (qrLock.current) return;
    qrLock.current = true;

    try {
      const response = await axios.get(
        `https://riis.denrcalabarzon.com/api/fetchNativeAPI`,
        { params: { id: data } }
      );

      setTimeout(() => {
        // Release camera by navigating only after unmount
        router.push({
          pathname: "../search",
          params: {
            qrCode: data,
            details: JSON.stringify(response.data),
          },
        });
        qrLock.current = false;
      }, 500);
    } catch (error) {
      console.error("API Error:", error);
      qrLock.current = false;
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>Camera access is denied.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "QR Code",
          headerShown: false, // Hide default header
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("../create")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Code Scanner</Text>
      </View>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        />
      )}
      <Overlay />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
