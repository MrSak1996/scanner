import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "./static_data/AuthContext"; // Import useAuth

const LoginScreen = () => {
  const router = useRouter();
  const { setUser } = useAuth(); // Get setUser from AuthContext
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
  
    setIsLoading(true);
    try {
      const url = "https://d98c-180-232-3-94.ngrok-free.app/api/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      setIsLoading(false);
  
      if (response.ok && data.api_token) {
        Alert.alert("Success", "Login successful!");
        // console.log(data);
        setUser(data); // Store user data globally
        router.push("/(tabs)/scanner");
      } else {
        Alert.alert("Error", data.message || "Invalid credentials.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Login", headerShown: false }} />
      <Image
        style={styles.img}
      source={require("../../assets/images/denr_logo.png")}
      />
      <Text style={styles.img_title}>Department of Environment and Natural Resources</Text>
      <Text style={styles.img_title}>Region IV-A (CALABARZON)</Text>
      <Image
        style={styles.backgroundImage}
        source={require("../../assets/images/background.jpg")}
      />
      <View style={styles.content}>
        <Text style={styles.title}>ICT Inventory System</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="gray"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        
      </View>
  
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  content: {
    width: "80%",
    alignItems: "center",
    top:-50
  },
  img_title:{
    fontFamily:'Times New Roman',
    fontSize:16,
    bottom:300,
    right:-50,
    zIndex:40
  },
  img:{
    width:100,
    height:100,
    bottom:220,
    right:160,
    zIndex:40
  },
  backgroundImage: {
    position: "absolute",
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily:"PoppinsRegular"
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily:"PoppinsRegular"
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#00695C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
