import React, { useState } from "react";
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
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProps = {
  onNavigate: (screen: "home") => void;
};

const BiometricsPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUseBiometrics = async () => {
    setIsLoading(true);

    try {
      await AsyncStorage.setItem("biometrics_enabled", "true");

      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          "Biometrics Setup",
          "You can now use biometric authentication to log into the app",
          [{ text: "OK", onPress: () => onNavigate("home") }]
        );
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Failed to setup biometrics");
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem("biometrics_enabled", "false");
      onNavigate("home");
    } catch (error) {
      console.error("Error saving biometrics preference:", error);
      onNavigate("home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.biometricsIcon}>
            <Ionicons name="finger-print" size={40} color="white" />
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Use Bio Metrics</Text>
          <Text style={styles.subtitle}>
            Use Bio Metrics to log into the app faster{"\n"}
            and more securely.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleUseBiometrics}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Setting up..." : "Use Bio Metrics"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={isLoading}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.faceIdDemo}>
            <View style={styles.faceIdIcon}>
              <View style={styles.faceIdFrame}>
                <View style={styles.faceIdCorner} />
                <View style={[styles.faceIdCorner, styles.topRight]} />
                <View style={[styles.faceIdCorner, styles.bottomLeft]} />
                <View style={[styles.faceIdCorner, styles.bottomRight]} />
              </View>
            </View>
            <Text style={styles.faceIdText}>Face ID</Text>
          </View>
        </View>

        <View style={styles.stepIndicatorContainer}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                {
                  backgroundColor: index < 3 ? "#00C853" : "#e0e0e0",
                },
              ]}
            />
          ))}
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
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  iconContainer: {
    marginBottom: 40,
  },
  biometricsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00C853",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 60,
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
  buttonsContainer: {
    width: "100%",
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: "#00C853",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#00C853",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#a0a0a0",
    shadowOpacity: 0.1,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  faceIdDemo: {
    alignItems: "center",
  },
  faceIdIcon: {
    marginBottom: 12,
  },
  faceIdFrame: {
    width: 60,
    height: 60,
    backgroundColor: "#666",
    borderRadius: 8,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  faceIdCorner: {
    position: "absolute",
    width: 12,
    height: 12,
    borderColor: "#00C853",
    borderWidth: 2,
    top: 8,
    left: 8,
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
  },
  topRight: {
    top: 8,
    right: 8,
    left: "auto",
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },
  bottomLeft: {
    bottom: 8,
    top: "auto",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  bottomRight: {
    bottom: 8,
    right: 8,
    top: "auto",
    left: "auto",
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
  },
  faceIdText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    position: "absolute",
    bottom: 60,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default BiometricsPage;