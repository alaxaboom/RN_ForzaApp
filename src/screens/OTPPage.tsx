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
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProps = {
  onNavigate: (screen: "home" | "register" | "login") => void;
  phoneNumber?: string;
};

const OTPPage: React.FC<NavigationProps> = ({
  onNavigate,
  phoneNumber = "+387-545-8545",
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(115);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNumberPress = (number: string) => {
    const emptyIndex = otp.findIndex((digit) => digit === "");
    if (emptyIndex !== -1) {
      const newOtp = [...otp];
      newOtp[emptyIndex] = number;
      setOtp(newOtp);

      if (emptyIndex === 3) {
        setTimeout(() => {
          verifyOTP(newOtp);
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    const lastFilledIndex = otp
      .map((digit, index) => (digit !== "" ? index : -1))
      .filter((index) => index !== -1)
      .pop();

    if (lastFilledIndex !== undefined) {
      const newOtp = [...otp];
      newOtp[lastFilledIndex] = "";
      setOtp(newOtp);
    }
  };

  const verifyOTP = (code: string[]) => {
    const enteredCode = code.join("");

    if (enteredCode.length === 4) {
      Alert.alert("Code Verified", "SMS code successfully verified!", [
        { text: "OK", onPress: () => onNavigate("home") },
      ]);
    } else {
      Alert.alert("Error", "Invalid code");
      setOtp(["", "", "", ""]);
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setTimer(115);
      setCanResend(false);
      setOtp(["", "", "", ""]);
      Alert.alert("Code Sent", "New SMS code sent to your number");
    }
  };

  const renderOTPInput = () => {
    return (
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <View key={index} style={styles.otpBox}>
            <Text style={styles.otpText}>{digit}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderKeyboard = () => {
    const numbers = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "*",
      "0",
      "#",
    ];

    return (
      <View style={styles.keyboard}>
        {numbers.map((num, index) => (
          <TouchableOpacity
            key={index}
            style={styles.keyboardButton}
            onPress={() => {
              if (num === "*") {
                handleBackspace();
              } else if (num === "#") {
              } else {
                handleNumberPress(num);
              }
            }}
          >
            <Text style={styles.keyboardButtonText}>
              {num === "*" ? "⌫" : num}
            </Text>
            {num === "2" && <Text style={styles.keyboardSubText}>ABC</Text>}
            {num === "3" && <Text style={styles.keyboardSubText}>DEF</Text>}
            {num === "4" && <Text style={styles.keyboardSubText}>GHI</Text>}
            {num === "5" && <Text style={styles.keyboardSubText}>JKL</Text>}
            {num === "6" && <Text style={styles.keyboardSubText}>MNO</Text>}
            {num === "7" && <Text style={styles.keyboardSubText}>PQRS</Text>}
            {num === "8" && <Text style={styles.keyboardSubText}>TUV</Text>}
            {num === "9" && <Text style={styles.keyboardSubText}>WXYZ</Text>}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate("register")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Enter the sms code</Text>
          <Text style={styles.subtitle}>
            Enter the code sent to{"\n"}
            {phoneNumber}
          </Text>
        </View>

        {renderOTPInput()}

        <View style={styles.timerSection}>
          <Text style={styles.timerText}>
            {canResend ? (
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={styles.resendText}>Send again</Text>
              </TouchableOpacity>
            ) : (
              `Send again in ${formatTime(timer)}`
            )}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>From Message</Text>
          <Text style={styles.infoNumber}>5535</Text>
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  titleSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  timerSection: {
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: "#666",
  },
  resendText: {
    fontSize: 14,
    color: "#00C853",
    fontWeight: "500",
  },
  infoSection: {
    alignItems: "center",
    marginTop: 20,
  },
  infoText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  infoNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#f8f8f8",
  },
  keyboardButton: {
    width: "30%",
    aspectRatio: 1.2,
    justifyContent: "center",
    alignItems: "center",
    margin: "1.5%",
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  keyboardButtonText: {
    fontSize: 24,
    fontWeight: "400",
    color: "#333",
  },
  keyboardSubText: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
});

export default OTPPage;