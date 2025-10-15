import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  resetLoanForm,
  setCurrentStep,
} from "../../store/loanSlice";
import { useAuth } from "../../hooks/useAuth";
import { useLoanManagement } from "../../hooks/useLoanManagement";
import { useSmartNavigation } from "../../utils/navigation";
import StepIndicator from "./StepIndicator";
import ProductSelectionScreen from "./ProductSelectionScreen";
import LoanCalculatorScreen from "./LoanCalculatorScreen";
import RegistrationScreen from "./RegistrationScreen";
import DocumentUploadScreen from "./DocumentUploadScreen";
import ConfirmationScreen from "./ConfirmationScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from "react-native";
import { useRegistrationFlow } from "../../hooks/useRegistrationFlow";

type NavigationProps = {
  onNavigate: (
    screen: "home" | "loan" | "login" | "register" | "otp" | "password" | "firstpage",
    params?: any
  ) => void;
  onExitLoanProcess: () => void;
  screenParams?: any;
};

const LoanPage: React.FC<NavigationProps> = ({ onNavigate, onExitLoanProcess, screenParams }) => {
  const dispatch = useAppDispatch();
  const loanForm = useAppSelector((state) => state.loan);
  const { user: authUser, isAuthenticated, loginUser } = useAuth();
  const { prefillFormWithUserData } = useLoanManagement();
  const { isCreating: isSubmitting } = useLoanManagement();
  const { navigateToHomeOrFirst } = useSmartNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const registrationFlow = useRegistrationFlow({ onNavigate, onExitLoanProcess });

  useEffect(() => {
    if (isAuthenticated && authUser && !registrationFlow.justRegistered) {
      if (!loanForm.userData.firstName.trim() && !loanForm.userData.lastName.trim()) {
        prefillFormWithUserData();
        registrationFlow.setEmail(authUser.email || "");
      }
    }
  }, [isAuthenticated, authUser, loanForm.userData.firstName, loanForm.userData.lastName, registrationFlow.justRegistered]);

  useEffect(() => {
    if (screenParams?.finalize) {
      setIsFinalizing(true);
      finalizeLoan();
    }
  }, [screenParams]);

  const finalizeLoan = async () => {
    try {
      const pending = await AsyncStorage.getItem("loan_pending");
      if (pending) {
        const { user } = JSON.parse(pending);
        await loginUser(user);
        await AsyncStorage.removeItem("loan_pending");
      }
      onExitLoanProcess();
      dispatch(resetLoanForm());
      navigateToHomeOrFirst(onNavigate);
    } catch (error) {
      console.error("Finalize loan error:", error);
      Alert.alert("Error", "Failed to complete loan process");
      onExitLoanProcess();
    }
  };

  const handleBack = () => {
    if (isProcessing || registrationFlow.isProcessing) return;
    switch (loanForm.currentStep) {
      case "calculator":
        dispatch(setCurrentStep("productcategories"));
        break;
      case "registration":
        dispatch(setCurrentStep("calculator"));
        break;
      case "documents":
        dispatch(setCurrentStep("registration"));
        break;
      case "confirmation":
        dispatch(setCurrentStep("documents"));
        break;
      default:
        onExitLoanProcess();
        navigateToHomeOrFirst(onNavigate);
        break;
    }
  };

  const handleNext = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      switch (loanForm.currentStep) {
        case "productcategories":
          if (loanForm.selectedProduct) {
            dispatch(setCurrentStep("calculator"));
          }
          break;
        case "calculator":
          dispatch(setCurrentStep("registration"));
          break;
        case "registration":
          await registrationFlow.handleRegistrationSubmit();
          break;
        case "documents":
          dispatch(setCurrentStep("confirmation"));
          break;
        case "confirmation":
          dispatch(resetLoanForm());
          const existingPasscode = await AsyncStorage.getItem("app_passcode");
          onExitLoanProcess();
          if (!existingPasscode) {
            onNavigate("password");
          } else {
            await finalizeLoan();
          }
          break;
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCurrentScreen = () => {
    if (isFinalizing) {
      return null;
    }

    if (loanForm.currentStep === "registration" && registrationFlow.justRegistered) {
      dispatch(setCurrentStep("documents"));
      return null;
    }

    switch (loanForm.currentStep) {
      case "productcategories":
        return <ProductSelectionScreen />;
      case "calculator":
        return <LoanCalculatorScreen />;
      case "registration":
        return (
          <RegistrationScreen
            isAuthenticated={registrationFlow.isAuthenticated}
            email={registrationFlow.email}
            setEmail={registrationFlow.setEmail}
            password={registrationFlow.password}
            setPassword={registrationFlow.setPassword}
            confirmPassword={registrationFlow.confirmPassword}
            setConfirmPassword={registrationFlow.setConfirmPassword}
            showPassword={registrationFlow.showPassword}
            setShowPassword={registrationFlow.setShowPassword}
            showConfirmPassword={registrationFlow.showConfirmPassword}
            setShowConfirmPassword={registrationFlow.setShowConfirmPassword}
            isChecked={registrationFlow.isChecked}
            setIsChecked={registrationFlow.setIsChecked}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
          />
        );
      case "documents":
        return (
          <DocumentUploadScreen
            uploadedDocuments={uploadedDocuments}
            setUploadedDocuments={setUploadedDocuments}
            onSkip={handleNext}
            onContinue={handleNext}
          />
        );
      case "confirmation":
        return <ConfirmationScreen onDone={async () => {
          dispatch(resetLoanForm());
          onExitLoanProcess();
          const existingPasscode = await AsyncStorage.getItem("app_passcode");
          if (!existingPasscode) {
            onNavigate("password");
          } else {
            await finalizeLoan();
          }
        }} />;
      default:
        return null;
    }
  };

  const getScreenData = () => {
    switch (loanForm.currentStep) {
      case "productcategories":
        return {
          title: "Select a product",
          subtitle: "Step 1 of 4 • Estimated completion time: 2 min",
        };
      case "calculator":
        return {
          title: "Select amount and period",
          subtitle: "Step 2 of 4 • Estimated completion time: 2 min",
        };
      case "registration":
      case "documents":
        return {
          title: loanForm.currentStep === "registration"
            ? "Fill in the personal data"
            : "Add documents (optional)",
          subtitle: "Step 3 of 4 • Estimated completion time: 2 min",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  if (isFinalizing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00C853" />
        </View>
      </SafeAreaView>
    );
  }

  if (loanForm.currentStep === "confirmation") {
    return <ConfirmationScreen onDone={async () => {
      dispatch(resetLoanForm());
      onExitLoanProcess();
      const existingPasscode = await AsyncStorage.getItem("app_passcode");
      if (!existingPasscode) {
        onNavigate("password");
      } else {
        await finalizeLoan();
      }
    }} />;
  }

  const { title, subtitle } = getScreenData();
  const showContinueButton = loanForm.currentStep !== "documents";
  const isDisabled = isProcessing || isSubmitting ||
    (loanForm.currentStep === "productcategories" && !loanForm.selectedProduct) ||
    (loanForm.currentStep === "registration" &&
      (!loanForm.userData.firstName.trim() ||
        !loanForm.userData.lastName.trim() ||
        !loanForm.userData.phone.trim() ||
        !loanForm.userData.jmbg.trim() ||
        (!registrationFlow.isAuthenticated && (registrationFlow.password.length < 6 || registrationFlow.password !== registrationFlow.confirmPassword))));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} disabled={isProcessing || registrationFlow.isProcessing}>
            <Ionicons name="arrow-back" size={30} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>{title}</Text>
        </View>

        <StepIndicator />

        <View style={styles.screenBody}>
          <Text style={styles.screenSubtitle}>{subtitle}</Text>
          {renderCurrentScreen()}
        </View>

        <View style={styles.bottomSpacer} />

        {showContinueButton && (
          <View style={styles.continueButtonWrapper}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                isDisabled && styles.continueButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={isDisabled}
            >
              <Text style={styles.continueButtonText}>
                {isProcessing || isSubmitting || registrationFlow.isProcessing ? "Submitting..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Private "General Terms of Business"</Text>
            <Text style={styles.modalText}>
              By marking this field when filling out a loan application on the website www.kreddy.ba, which is owned by Microcredit Company "Digital Finance International" d.o.o. Banja Luka, I am fully aware of the "General Terms and Conditions" of Microcredit Company "Digital Finance International" d.o.o. Banja Luka with them and their rights and obligations contained in them.
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 10,
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
  screenHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: "white",
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  screenBody: {
    flex: 1,
    paddingHorizontal: 26,
    paddingBottom: 6,
  },
  screenSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 42,
    paddingHorizontal: 30,
  },
  continueButtonWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  continueButton: {
    backgroundColor: "#00C853",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalCloseButton: {
    backgroundColor: '#00C853',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoanPage;