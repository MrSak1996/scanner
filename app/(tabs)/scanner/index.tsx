import React, { useState, useRef, useEffect } from "react";
import { AppState, SafeAreaView, StyleSheet, StatusBar, Platform } from "react-native";
import { Camera, CameraView } from "expo-camera"; 
import { Stack, useRouter } from "expo-router";
import { Overlay } from "../Overlay"; 

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

  const handleBarcodeScanned = ({ data }) => {
      qrLock.current = false;
      setTimeout(() => {
        router.push({
          pathname: "../create",
          params: { qrCode: data },
        });
      }, 500);
    
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
