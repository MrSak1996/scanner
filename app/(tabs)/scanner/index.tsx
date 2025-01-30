import React, { useState, useRef, useEffect } from "react";
import { AppState, SafeAreaView, StyleSheet, StatusBar, Platform,Alert } from "react-native";
import { Camera, CameraView } from "expo-camera"; 
import { Stack, useRouter } from "expo-router";
import { Overlay } from "../Overlay"; 
import axios from "axios";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const router = useRouter();

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
    qrLock.current = false;
  
    try {
      const response = await axios.get(`https://b9a0-180-232-3-93.ngrok-free.app/api/fetchNativeAPI?id=${data}`, {
        params: { qrCode: data },
      });
      if (response.data[0].control_id) {
        setTimeout(() => {
          router.push({
            pathname: "../create",
            params: { qrCode: data, details: response.data.result },
          });
        }, 500);
      } else {
      }
    } catch (error) {
      alert("Failed to fetch QR Code data.");
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
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
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
