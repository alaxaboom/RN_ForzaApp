import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProps = {
  onNavigate: (screen: "home" | "biometrics" | "loan", params?: any) => void;
  mode?: "create" | "enter";
};

type PasswordStep = "create" | "confirm" | "enter";

const PasswordPage: React.FC<NavigationProps> = ({
  onNavigate,
  mode = "create",
}) => {
  const [passcode, setPasscode] = useState<string[]>([]);
  const [step, setStep] = useState<PasswordStep>(
    mode === "create" ? "create" : "enter"
  );
  const [firstPasscode, setFirstPasscode] = useState<string>("");
  const [storedPasscode, setStoredPasscode] = useState<string>("");

  useEffect(() => {
    const loadStoredPasscode = async () => {
      try {
        const saved = await AsyncStorage.getItem("app_passcode");
        if (saved) {
          setStoredPasscode(saved);
        }
      } catch (error) {
        console.error("Error loading passcode:", error);
      }
    };

    if (mode === "enter") {
      loadStoredPasscode();
    }
  }, [mode]);

  const handleNumberPress = (number: string) => {
    if (passcode.length < 4) {
      const newPasscode = [...passcode, number];
      setPasscode(newPasscode);

      if (newPasscode.length === 4) {
        setTimeout(() => {
          handlePasscodeComplete(newPasscode.join(""));
        }, 200);
      }
    }
  };

  const handleBackspace = () => {
    if (passcode.length > 0) {
      setPasscode(passcode.slice(0, -1));
    }
  };

  const handlePasscodeComplete = async (code: string) => {
    switch (step) {
      case "create":
        setFirstPasscode(code);
        setPasscode([]);
        setStep("confirm");
        break;

        case "confirm":
  if (code === firstPasscode) {
    try {
      await AsyncStorage.setItem("app_passcode", code);
      const loanPending = await AsyncStorage.getItem("loan_pending");
      if (loanPending) {
        onNavigate("loan", { finalize: true });
      } else {
        onNavigate("home");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save password");
    }
  } else {
    Alert.alert("Error", "Passwords don't match. Please try again.");
    setPasscode([]);
    setStep("create");
    setFirstPasscode("");
  }
  break;
      case "enter":
        if (code === storedPasscode) {
          onNavigate("home");
        } else {
          Alert.alert("Error", "Incorrect password");
          setPasscode([]);
        }
        break;
    }
  };

  const getTitle = () => {
    switch (step) {
      case "create":
        return "Create a passcode";
      case "confirm":
        return "Enter the passcode again";
      case "enter":
        return "Enter passcode";
      default:
        return "Passcode";
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case "create":
        return "To quickly enter app";
      case "confirm":
        return "Confirm your new passcode";
      case "enter":
        return "Enter your passcode to continue";
      default:
        return "";
    }
  };

  const renderPasscodeInput = () => {
    return (
      <View style={styles.passcodeContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.passcodeCircle,
              {
                backgroundColor: passcode[index] ? "#00C853" : "#e0e0e0",
                borderColor: passcode[index] ? "#00C853" : "#e0e0e0",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeyboard = () => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

    return (
      <View style={styles.keyboard}>
        {numbers.map((num, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.keyboardButton, num === "" && styles.emptyButton]}
            onPress={() => {
              if (num === "⌫") {
                handleBackspace();
              } else if (num !== "") {
                handleNumberPress(num);
              }
            }}
            disabled={num === ""}
          >
            {num !== "" && <Text style={styles.keyboardButtonText}>{num}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderStepIndicator = () => {
    if (step === "enter") return null;

    
    const currentStepIndex = step === "create" ? 1 : 2;

    return (
      <View style={styles.stepIndicatorContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              {
                backgroundColor:
                  index < currentStepIndex ? "#00C853" : "#e0e0e0",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        {renderStepIndicator()}

        {renderPasscodeInput()}

        {step === "confirm" && (
          <Text style={styles.helperText}>
            Re-enter the passcode you just created
          </Text>
        )}
      </View>

      {renderKeyboard()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 60,
    gap: 12,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  passcodeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
    gap: 16,
  },
  passcodeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  helperText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  keyboardButton: {
    width: "30%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: "1.5%",
  },
  emptyButton: {
    backgroundColor: "transparent",
  },
  keyboardButtonText: {
    fontSize: 32,
    fontWeight: "300",
    color: "#333",
  },
});

export default PasswordPage;