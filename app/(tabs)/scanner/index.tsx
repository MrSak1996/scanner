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

export default function Home() {
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
    if (qrLock.current) return; // Prevent multiple scans
    qrLock.current = true;

    try {
      const response = await axios.get(
        `https://d98c-180-232-3-94.ngrok-free.app/api/fetchNativeAPI`,
        { params: { id: data } }
      );

      if (response.data && response.data.length > 0 && response.data[0].control_id) {
        setTimeout(() => {
          router.push({
            pathname: "../create",
            params: {
              qrCode: data,
              details: JSON.stringify(response.data),
            },
          });
          qrLock.current = false; // Unlock after navigation
        }, 500);
      } else {
        alert("Invalid QR Code or No Data Found");
        qrLock.current = false;
      }
    } catch (error) {
      alert("Failed to fetch data. Please try again.");
      console.error("API Error:", error);
      qrLock.current = false;
    }
  };

  // 🚨 Show error message if permission not granted
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
          headerShown: true,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
      />
      <Overlay/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
