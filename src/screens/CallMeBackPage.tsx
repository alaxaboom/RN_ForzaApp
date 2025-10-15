import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";

type CallMeBackPageProps = {
  visible: boolean;
  onClose: () => void;
};

const CallMeBackPage: React.FC<CallMeBackPageProps> = ({ visible, onClose }) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [callTime, setCallTime] = useState<"immediately" | "schedule">("immediately");
  const [date, setDate] = useState("24 June 2024 (Monday)");
  const [time, setTime] = useState("08:00");

  const handleSubmit = () => {
    console.log({ name, phone, callTime, date, time });
    setTimeout(() => {
      setStep("success");
    }, 500);
  };

  const handleGotIt = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {step === "form" ? (
              <>
                <Text style={styles.title}>We are here to help if you need it</Text>
                <Text style={styles.subtitle}>
                  Leave your phone number and we will call you in 15 minutes if it is working hours, or schedule a call yourself when it suits you.
                </Text>

                <Text style={styles.sectionTitle}>When do you want us to call you?</Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[styles.toggleButton, callTime === "immediately" && styles.activeToggle]}
                    onPress={() => setCallTime("immediately")}
                  >
                    <Text style={[styles.toggleText, callTime === "immediately" && styles.activeToggleText]}>Immediately</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleButton, callTime === "schedule" && styles.activeToggle]}
                    onPress={() => setCallTime("schedule")}
                  >
                    <Text style={[styles.toggleText, callTime === "schedule" && styles.activeToggleText]}>Schedule a call</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                {callTime === "schedule" && (
                  <>
                    <View style={styles.dropdownContainer}>
                      <TextInput
                        style={styles.dropdownInput}
                        placeholder="24 June 2024 (Monday)"
                        value={date}
                        onChangeText={setDate}
                        editable={false}
                      />
                      <Text style={styles.dropdownArrow}>▼</Text>
                    </View>
                    <View style={styles.dropdownContainer}>
                      <TextInput
                        style={styles.dropdownInput}
                        placeholder="Time: 08:00"
                        value={time}
                        onChangeText={setTime}
                        editable={false}
                      />
                      <Text style={styles.dropdownArrow}>▼</Text>
                    </View>
                  </>
                )}

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>Send a request</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.successIcon}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Message sent</Text>
                <Text style={styles.successSubtitle}>
                  Thank you for your interest in the product
                </Text>
                <TouchableOpacity style={styles.gotItButton} onPress={handleGotIt}>
                  <Text style={styles.gotItText}>Got it</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "98%",
  },
  content: {
    flex: 1,
    padding: 30,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    color: "#999",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  activeToggle: {
    backgroundColor: "#fff",
    borderColor: "#00C853",
  },
  toggleText: {
    fontSize: 14,
    color: "#333",
  },
  activeToggleText: {
    color: "#00C853",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f5f5f5",
  },
  dropdownContainer: {
    position: "relative",
    marginBottom: 15,
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f5f5f5",
  },
  dropdownArrow: {
    position: "absolute",
    right: 15,
    top: 15,
    fontSize: 16,
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#00C853",
    fontSize: 16,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 30,
    color: "#00C853",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  gotItButton: {
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  gotItText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CallMeBackPage;