import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch } from "../store/store";
import {
  setUserData,
} from "../store/loanSlice";

type NavigationProps = {
  onNavigate: (screen: "home" | "login" | "loan") => void;
};

const RegisterPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleRegister = () => {
    if (!phone.trim() || !firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 12) {
      Alert.alert("Error", "Invalid phone number");
      return;
    }

 
    dispatch(setUserData({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: cleanPhone,
      jmbg: "", 
    }));
    
    onNavigate("loan");
  };

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.startsWith("387")) {
      const formatted = cleaned.replace(
        /(\d{3})(\d{2})(\d{3})(\d{3})/,
        "+$1 $2 $3 $4"
      );
      return formatted;
    }
    return text;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate("login")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign up</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.textInput}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={(text) => setPhone(formatPhone(text))}
              placeholder="+387 36 576 489"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={16}
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Registrate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            By registering, you agree to our Terms of Service and Privacy
            Policy.
          </Text>
          <Text style={styles.infoSubtext}>
            We'll send you an SMS with a verification code.
          </Text>
        </View>

        <View style={styles.loginSection}>
          <Text style={styles.loginPrompt}>Already have an account?</Text>
          <TouchableOpacity onPress={() => onNavigate("login")}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  textInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  registerButton: {
    backgroundColor: "#00C853",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: 12,
    color: "#00C853",
    textAlign: "center",
    fontWeight: "500",
  },
  loginSection: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: "auto",
    marginBottom: 32,
  },
  loginPrompt: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  loginLink: {
    color: "#00C853",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

export default RegisterPage;