import React, { useState, useRef, useEffect } from "react";
import { AppState, SafeAreaView, StyleSheet, View } from "react-native";
import { Stack, useRouter } from "expo-router";

const About = () => {


  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: "About",
          headerShown: true,
        }}
      />
      </SafeAreaView>
  );
};

export default About;

