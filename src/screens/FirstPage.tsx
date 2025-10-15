import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavigation from '../utils/BottomNavigation';
import { Screen } from '../types/index';

const { width } = Dimensions.get("window");

type NavigationProps = {
  onNavigate: (screen: Screen, params?: any) => void;
};

const FirstPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const handleApplyForLoan = () => {
    onNavigate("loan");
  };

  const handleCallMeBack = () => {
    onNavigate("callback");
  };

  const handleLogin = () => {
    onNavigate("login");
  };

  return (
    <LinearGradient
      colors={["#00C853", "#00B047", "#009624"]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <Text style={styles.welcomeTitle}>Welcome to{"\n"}Forza App</Text>
            <Text style={styles.subtitle}>Quick loans in 15 minutes</Text>
          </View>

          <View style={styles.benefitsContainer}>
            <View style={styles.benefitsRow}>
              <View style={[styles.benefitCard, styles.topLeft]}>
                <Ionicons name="checkmark-sharp" size={18} color="white" />
                <Text style={styles.benefitText}>
                  30 days without{"\n"}interest or costs
                </Text>
              </View>
              <View style={[styles.benefitCard, styles.topRight]}>
                <Ionicons name="checkmark-sharp" size={18} color="white" />
                <Text style={styles.benefitText}>
                  Up to 36 months of{"\n"}repayment
                </Text>
              </View>
            </View>
            <View style={styles.benefitsRow}>
              <View style={[styles.benefitCard, styles.bottomLeft]}>
                <Ionicons name="checkmark-sharp" size={18} color="white" />
                <Text style={styles.benefitText}>Approval on the spot</Text>
              </View>
              <View style={[styles.benefitCard, styles.bottomRight]}>
                <Ionicons name="checkmark-sharp" size={18} color="white" />
                <Text style={styles.benefitText}>No hidden costs</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.contentSection}>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleApplyForLoan}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="folder-sharp" size={28} color="white" />
            </View>
            <View style={styles.actionButtonTextContainer}>
              <Text style={styles.actionButtonTitle}>Apply for a loan</Text>
              <Text style={styles.actionButtonSubtitle}>1 day approve</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCallMeBack}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="call-sharp" size={28} color="white" />
            </View>
            <View style={styles.actionButtonTextContainer}>
              <Text style={styles.actionButtonTitle}>Call me back</Text>
              <Text style={styles.actionButtonSubtitle}>Loan by phone</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.loginSection}>
          <Text style={styles.loginPrompt}>or login here</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.bottomNavContainer}>
        <BottomNavigation
          onNavigate={onNavigate}
          currentScreen="firstpage"
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  headerSafeArea: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerSection: {},
  headerTop: {
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 10,
    opacity: 0.9,
  },
  benefitsContainer: {
    marginHorizontal: 10,
  },
  benefitsRow: {
    flexDirection: "row",
  },
  benefitCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  topLeft: {
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderRightWidth: 0.25,
    borderBottomWidth: 0.25,
  },
  topRight: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0.25,
    borderBottomWidth: 0.25,
  },
  bottomLeft: {
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0.25,
    borderTopWidth: 0.25,
  },
  bottomRight: {
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0.25,
    borderTopWidth: 0.25,
  },
  benefitText: {
    color: "white",
    fontSize: 13,
    marginLeft: 8,
    fontWeight: "500",
    lineHeight: 16,
    flex: 1,
  },
  contentSection: {
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingTop: 35,
    flex: 1,
    marginTop: 45,
    overflow: 'hidden',
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: (width - 64) / 2,
    minHeight: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  actionButtonTextContainer: {},
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  loginSection: {
    alignItems: "center",
   
  },
  loginPrompt: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#00C853",
    borderRadius: 16,
    paddingHorizontal: 48,
    paddingVertical: 20,
    width: width - 58,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  bottomNavContainer: {
    backgroundColor: 'white',
  },
});

export default FirstPage;