import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store, persistor, useAppSelector } from "./src/store/store";
import { Screen } from './src/types/index';
import HomePage from "./src/screens/HomePage";
import LoanPage from "./src/screens/loan/LoanPage";
import LoginPage from "./src/screens/LoginPage";
import RegisterPage from "./src/screens/RegisterPage";
import OTPPage from "./src/screens/OTPPage";
import PasswordPage from "./src/screens/PasswordPage";
import BiometricsPage from "./src/screens/BiometricsPage";
import ResetPasswordPage from "./src/screens/ResetPasswordPage";
import ProductsListPage from "./src/screens/ProductsListPage";
import ProfilePage from "./src/screens/ProfilePage";
import FirstPage from "./src/screens/FirstPage";
import CallMeBackPage from "./src/screens/CallMeBackPage";
import HowToPayPage from "./src/screens/HowToPayPage";
import ContactUsPage from "./src/screens/ContactUsPage";
import LocationPage from "./src/screens/LocationPage";
import { resetLoanForm } from "./src/store/loanSlice";
import { useDispatch } from "react-redux";

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#00C853" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const AppNavigator = () => {
  const dispatch = useDispatch();

  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  const [screenParams, setScreenParams] = useState<any>(null);
  const [isPasscodeChecked, setIsPasscodeChecked] = useState(false);
  const [passcodeExists, setPasscodeExists] = useState(false);
  const [isCallbackVisible, setIsCallbackVisible] = useState(false);
  const [callbackSourceScreen, setCallbackSourceScreen] = useState<Screen | null>(null);
  const [isInLoanProcess, setIsInLoanProcess] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkPasscode = async () => {
      try {
        const passcode = await AsyncStorage.getItem("app_passcode");
        setPasscodeExists(!!passcode);
      } catch (error) {
        console.error("Passcode check error:", error);
        setPasscodeExists(false);
      } finally {
        setIsPasscodeChecked(true);
      }
    };
    checkPasscode();
  }, []);

  useEffect(() => {
    if (isPasscodeChecked && currentScreen === null) {
      if (isInLoanProcess) {
        setCurrentScreen("loan");
      } else if (isAuthenticated) {
        setCurrentScreen(passcodeExists ? "password" : "home");
      } else {
        setCurrentScreen("firstpage");
      }
    }
  }, [isPasscodeChecked, isAuthenticated, passcodeExists, isInLoanProcess, currentScreen]);

  const navigateTo = (screen: Screen, params?: any) => {
    if (screen === "callback") {
      setCallbackSourceScreen(currentScreen);
      setIsCallbackVisible(true);
      return;
    }

    if (screen === "loan") {
      dispatch(resetLoanForm());
      setIsInLoanProcess(true);
      AsyncStorage.setItem("in_loan_process", "true");
    }

    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const handleExitLoanProcess = () => {
    setIsInLoanProcess(false);
    AsyncStorage.removeItem("in_loan_process");
  };

  const handleCallbackClose = () => {
    setIsCallbackVisible(false);
    if (callbackSourceScreen) {
      setCurrentScreen(callbackSourceScreen);
      setCallbackSourceScreen(null);
    } else {
      if (isAuthenticated) {
        setCurrentScreen(passcodeExists ? "password" : "home");
      } else {
        setCurrentScreen("firstpage");
      }
    }
  };

  if (!isPasscodeChecked || currentScreen === null) {
    return <LoadingScreen />;
  }

  return (
    <>
      {(() => {
        switch (currentScreen) {
          case "home":
            return <HomePage onNavigate={navigateTo} isAuthenticated={isAuthenticated} />;
          case "firstpage":
            return <FirstPage onNavigate={navigateTo} />;
          case "password":
            return <PasswordPage onNavigate={navigateTo} mode="enter" />;
          case "loan":
            return (
              <LoanPage
                onNavigate={navigateTo}
                onExitLoanProcess={handleExitLoanProcess}
                screenParams={screenParams}
              />
            );
          case "login":
            return <LoginPage onNavigate={navigateTo} />;
          case "register":
            return <RegisterPage onNavigate={navigateTo} />;
          case "otp":
            return <OTPPage onNavigate={navigateTo} />;
          case "biometrics":
            return <BiometricsPage onNavigate={navigateTo} />;
          case "resetpassword":
            return <ResetPasswordPage onNavigate={navigateTo} />;
          case "products":
            return <ProductsListPage onNavigate={navigateTo} initialTab={screenParams?.tab || "loans"} />;
          case "profile":
            return <ProfilePage onNavigate={navigateTo} />;
          case "howtopay":
            return <HowToPayPage onNavigate={navigateTo} />;
          case "locations":
            return <LocationPage onNavigate={navigateTo} />;
          case "contacts":
            return <ContactUsPage onNavigate={navigateTo} />;
          default:
            return <FirstPage onNavigate={navigateTo} />;
        }
      })()}

      {isCallbackVisible && (
        <CallMeBackPage
          visible={isCallbackVisible}
          onClose={handleCallbackClose}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});