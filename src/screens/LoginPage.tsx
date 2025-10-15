import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from "../hooks/useAuth";

type NavigationProps = {
  onNavigate: (screen: "home" | "register" | "resetpassword" | "firstpage") => void;
};

const LoginPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const result = await login(phone, password);
    if (result.success) {
      onNavigate("home");
    } else {
      Alert.alert("Login Error", result.error || "Invalid credentials");
    }
  };

  const handleBack = () => {
    onNavigate("firstpage");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log In</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          Please enter your credentials to continue
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="+387 00 000 000"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => onNavigate("resetpassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => onNavigate("register")}>
            <Text style={styles.registerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#00C853",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#00C853",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
    color: "#666",
  },
  registerLink: {
    fontSize: 16,
    color: "#00C853",
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
    textAlign: "center",
  },
});

export default LoginPage;