import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setUserData } from "../../store/loanSlice";
import { StyleSheet } from "react-native";

type RegistrationScreenProps = {
  isAuthenticated: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
};

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  isAuthenticated,
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
  setIsModalVisible,
}) => {
  const dispatch = useAppDispatch();
  const loanForm = useAppSelector((state) => state.loan);

  return (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Fill in your contact info</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={loanForm.userData.firstName}
          onChangeText={(text) =>
            dispatch(setUserData({ firstName: text }))
          }
          placeholder="First name"
          editable={!isAuthenticated}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={loanForm.userData.lastName}
          onChangeText={(text) => dispatch(setUserData({ lastName: text }))}
          placeholder="Last name"
          editable={!isAuthenticated}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={loanForm.userData.phone}
          onChangeText={(text) => dispatch(setUserData({ phone: text }))}
          placeholder="+387 00 000 000"
          keyboardType="phone-pad"
          editable={!isAuthenticated}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          placeholder="Email (optional)"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isAuthenticated}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={loanForm.userData.jmbg}
          onChangeText={(text) => dispatch(setUserData({ jmbg: text }))}
          placeholder="JMBG (13 digits)"
          keyboardType="numeric"
          maxLength={13}
          editable={!isAuthenticated}
        />
        <Text style={styles.helperText}>
          13-digit unique citizen identification number
        </Text>
      </View>

      {!isAuthenticated && (
        <>
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Password"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder="Repeat password"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      <View style={styles.termsCheckboxRow}>
        <TouchableOpacity
          style={[styles.checkbox, isChecked && styles.checkboxActive]}
          onPress={() => setIsChecked(!isChecked)}
        >
          {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
        </TouchableOpacity>
        <Text style={styles.termsText}>
          Accept the{" "}
          <Text
            style={styles.termsLink}
            onPress={() => setIsModalVisible(true)}
          >
            general conditions, data processing, verification of personal data, credit history check, marketing terms.
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: "#eeeeee",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "transparent",
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  termsCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 4,
  },
  checkboxActive: {
    backgroundColor: "#00C853",
  },
  termsText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  termsLink: {
    color: "#00C853",
    textDecorationLine: "underline",
  },
});

export default RegistrationScreen;