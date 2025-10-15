import React from "react";
import { View, Text } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from "../../store/store";
import { StyleSheet } from "react-native";

const StepIndicator = () => {
  const loanForm = useAppSelector((state) => state.loan);
  const displayStep = loanForm.currentStep === "documents" ? "registration" : loanForm.currentStep;

  type LoanStep =
    | "productcategories"
    | "calculator"
    | "registration"
    | "confirmation";

  const steps: { key: LoanStep; icon: string }[] = [
    { key: "productcategories", icon: "apps" },
    { key: "calculator", icon: "calculator" },
    { key: "registration", icon: "person" },
    { key: "confirmation", icon: "checkmark" },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.key === displayStep
  );

  return (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <View
            style={[
              styles.stepItem,
              index <= currentIndex && styles.stepItemActive,
            ]}
          >
            <View
              style={[
                styles.stepCircle,
                index < currentIndex && styles.stepCircleActive,
                index === currentIndex && styles.stepCircleCurrent,
              ]}
            >
              <Ionicons
                name={step.icon as any}
                size={20}
                color={
                  index < currentIndex ? "white" :
                    index === currentIndex ? "#00C853" :
                      "#999"
                }
              />
            </View>
            <Text
              style={[
                styles.stepLabel,
                index <= currentIndex && styles.stepLabelActive,
              ]}
            >
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepConnector,
                index < currentIndex && styles.stepConnectorActive,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepItemActive: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: "#00C853",
  },
  stepCircleCurrent: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#00C853",
  },
  stepLabel: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  stepLabelActive: {
    color: "#00C853",
    fontWeight: "600",
  },
  stepConnector: {
    height: 2,
    backgroundColor: "#e0e0e0",
    flex: 1,
    marginHorizontal: 0,
    marginTop: -25,
  },
  stepConnectorActive: {
    backgroundColor: "#00C853",
  },
});

export default StepIndicator;