import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/store';
import {  setCurrentStep } from '../store/loanSlice';
import { useAuth } from '../hooks/useAuth';
import { useLoanManagement } from '../hooks/useLoanManagement';

type UseRegistrationFlowProps = {
  onNavigate: (
    screen: "home" | "loan" | "login" | "register" | "otp" | "password" | "firstpage",
    params?: any
  ) => void;
  onExitLoanProcess: () => void;
};

export const useRegistrationFlow = ({ onNavigate, onExitLoanProcess }: UseRegistrationFlowProps) => {
  const dispatch = useAppDispatch();
  const loanForm = useAppSelector((state) => state.loan);
  const { isAuthenticated, createUserOnly, loginUser } = useAuth();
  const { submitLoanApplication } = useLoanManagement();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  const handleRegistrationSubmit = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await AsyncStorage.setItem("in_loan_process", "true");

      if (!isAuthenticated) {
        if (
          !loanForm.userData.firstName.trim() ||
          !loanForm.userData.lastName.trim() ||
          !loanForm.userData.phone.trim() ||
          !loanForm.userData.jmbg.trim()
        ) {
          Alert.alert("Error", "Please fill in all required fields");
          await AsyncStorage.removeItem("in_loan_process");
          return;
        }

        if (loanForm.userData.jmbg.length !== 13) {
          Alert.alert("Error", "JMBG must be 13 digits");
          await AsyncStorage.removeItem("in_loan_process");
          return;
        }

        if (password.length < 6) {
          Alert.alert("Error", "Password must be at least 6 characters");
          await AsyncStorage.removeItem("in_loan_process");
          return;
        }

        if (password !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match");
          await AsyncStorage.removeItem("in_loan_process");
          return;
        }

        const userData = {
          firstName: loanForm.userData.firstName.trim(),
          lastName: loanForm.userData.lastName.trim(),
          phone: loanForm.userData.phone.trim(),
          jmbg: loanForm.userData.jmbg.trim(),
          password: password,
          ...(email.trim() && { email: email.trim() }),
        };

        const createResult = await createUserOnly(userData);
        if (!createResult.success || !createResult.user) {
          Alert.alert("Registration Error", createResult.error || "Unable to create account");
          await AsyncStorage.removeItem("in_loan_process");
          return;
        }

        await loginUser(createResult.user);

        await AsyncStorage.setItem("loan_pending", JSON.stringify({
          user: createResult.user,
          loanData: {
            selectedProduct: loanForm.selectedProduct,
            loanAmount: loanForm.loanAmount,
            loanPeriod: loanForm.loanPeriod,
          }
        }));

        setJustRegistered(true);

        const submitResult = await submitLoanApplication(createResult.user.id);
        if (!submitResult.success) {
          await AsyncStorage.removeItem("loan_pending");
          await AsyncStorage.removeItem("in_loan_process");
          Alert.alert("Error", submitResult.error || "Unable to submit application");
          setJustRegistered(false);
          return;
        }

        dispatch(setCurrentStep("documents"));
      } else {
        const submitResult = await submitLoanApplication();
        if (!submitResult.success) {
          Alert.alert("Error", submitResult.error || "Unable to submit application");
          return;
        }
        dispatch(setCurrentStep("documents"));
      }
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing,
    isAuthenticated,
    loanForm.userData.firstName,
    loanForm.userData.lastName,
    loanForm.userData.phone,
    loanForm.userData.jmbg,
    loanForm.selectedProduct,
    loanForm.loanAmount,
    loanForm.loanPeriod,
    password,
    confirmPassword,
    email,
    dispatch,
    createUserOnly,
    loginUser,
    submitLoanApplication,
    onNavigate,
    onExitLoanProcess,
  ]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isChecked,
    setIsChecked,
    isProcessing,
    justRegistered,
    handleRegistrationSubmit,
    isAuthenticated,
  };
};