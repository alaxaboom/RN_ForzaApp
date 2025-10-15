import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from "../store/store";
import { useGetUserByIdQuery, useLazyLoginUserQuery } from "../store/api";

type NavigationProps = {
  onNavigate: (screen: "home" | "login" | "password") => void;
};

const ResetPasswordPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [phoneEmail, setPhoneEmail] = useState("");
  const [jmbg, setJmbg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foundUser, setFoundUser] = useState(null);

  const [triggerLogin] = useLazyLoginUserQuery();

  const formatJmbg = (text: string) => {
    const numbers = text.replace(/\D/g, "");
    return numbers.slice(0, 13);
  };

  const formatPhone = (text: string) => {
    const numbers = text.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
        6
      )}`;
    }
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
      6,
      9
    )}`;
  };

  const handlePhoneEmailChange = (text: string) => {
    setError("");

    if (text.includes("@")) {
      setPhoneEmail(text);
    } else {
      const formatted = formatPhone(text);
      setPhoneEmail(formatted);
    }
  };

  const handleJmbgChange = (text: string) => {
    setError("");
    const formatted = formatJmbg(text);
    setJmbg(formatted);
  };

  const searchUser = async () => {
    if (!phoneEmail.trim() || !jmbg.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (jmbg.length !== 13) {
      setError("JMBG must have exactly 13 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await triggerLogin({
        phone: phoneEmail.replace(/\s/g, ""),
        jmbg: jmbg,
      }).unwrap();

      if (result) {
        setFoundUser(result);
        Alert.alert(
          "User Found",
          "User successfully found. You can restore access.",
          [
            {
              text: "Continue",
              onPress: () => {
                Alert.alert(
                  "Success",
                  "You can create a new access code for the app.",
                  [{ text: "OK", onPress: () => onNavigate("password") }]
                );
              },
            },
          ]
        );
      } else {
        setError("User not found. Check phone and JMBG");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError("User not found");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate("login")}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>

        <View style={styles.content}>
          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color="#d32f2f" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone / E-mail</Text>
            <TextInput
              style={styles.input}
              value={phoneEmail}
              onChangeText={handlePhoneEmailChange}
              placeholder="Enter phone or email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>JMBG</Text>
            <TextInput
              style={styles.input}
              value={jmbg}
              onChangeText={handleJmbgChange}
              placeholder="Enter JMBG (13 digits)"
              keyboardType="numeric"
              maxLength={13}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.resetButton,
              (isLoading || !phoneEmail.trim() || !jmbg.trim()) &&
                styles.resetButtonDisabled,
            ]}
            onPress={searchUser}
            disabled={isLoading || !phoneEmail.trim() || !jmbg.trim()}
          >
            <Text style={styles.resetButtonText}>
              {isLoading ? "Searching..." : "Reset Password"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.helpText}>
            Enter phone or email address and JMBG to find your account
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    borderColor: "#ef5350",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "white",
    color: "#333",
  },
  resetButton: {
    backgroundColor: "#00C853",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#00C853",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  resetButtonDisabled: {
    backgroundColor: "#a0a0a0",
    shadowOpacity: 0.1,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  helpText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 20,
  },
});

export default ResetPasswordPage;