import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Screen } from "../types/index";
import BottomNavigation from "../utils/BottomNavigation";

type HowToPayPageProps = {
  onNavigate: (screen: Screen, params?: any) => void;
};

const HowToPayPage: React.FC<HowToPayPageProps> = ({ onNavigate }) => {

  return (
    <View style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainCard}>
          <Text style={styles.mainTitle}>How to pay</Text>

          <Text style={styles.paragraph}>
            Five days before the due date of your loan, we will send you an SMS and an email to remind you to repay the loan. Log in to your personal account to see the loan status and check the payment information.
          </Text>

          <Text style={styles.sectionTitle}>How do I repay the loan?</Text>
          <Text style={styles.paragraph}>
            You can pay your funds directly to our account in Addiko Bank ad Banja Luka, at post office counters or via internet and mobile banking. The account must contain the following information:
          </Text>

          <View style={styles.grayContainer}>
            <Text style={styles.grayTitle}>For clients RS</Text>
            <View style={styles.grayRow}>
              <Text style={styles.grayLabel}>User</Text>
              <Text style={styles.grayValue}>MKD "Digital Finance international" d.o.o. Banja Luka</Text>
            </View>
            <View style={styles.grayRow}>
              <Text style={styles.grayLabel}>Bank</Text>
              <Text style={styles.grayValue}>FORMER BANK ad Debtor Luke</Text>
            </View>
            <View style={styles.grayRow}>
              <Text style={styles.grayLabel}>Bill number</Text>
              <Text style={styles.grayValue}>5520001718929885</Text>
            </View>
            <View style={styles.grayRow}>
              <Text style={styles.grayLabel}>Reference number</Text>
              <Text style={styles.grayValue}>Credit Agreement number</Text>
            </View>
          </View>

          <View style={styles.grayContainer}>
            <Text style={styles.grayTitle}>For clients FBiH</Text>
            <View style={styles.grayRow}>
              <Text style={styles.grayLabel}>User</Text>
              <Text style={styles.grayValue}>MKD "Digital Finance international" d.o.o. Banja Luka</Text>
            </View>
            <View style={styles.grayRow}>
              <Text style={styles.grayLabel}>Bank</Text>
              <Text style={styles.grayValue}>FORMER BANK ad Debtor Luke</Text>
            </View>
            <View style={styles.grayRow}>
              <Text style={styles.grayLabel}>Bill number</Text>
              <Text style={styles.grayValue}>5520001718929885</Text>
            </View>
            <View style={styles.grayRow}>
              <Text style={styles.grayLabel}>Reference number</Text>
              <Text style={styles.grayValue}>Loan contract number</Text>
            </View>
          </View>

          <View style={styles.alertContainer}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>Important</Text>
              <View style={styles.exclamationIcon}>
                <Text style={styles.exclamationText}>!</Text>
              </View>
            </View>
            <Text style={styles.alertText}>
              For the sake of correct records of your payment, please enter the correct number of the loan batch in the CALL NUMBER field. If you are not able to repay the loan on time, and in order to avoid unnecessary delay costs, please contact us before the expiry of the deadline at number 051-492-610, option 2. In case of delay, reminders and debt collection are done by phone, SMS messages, e-mails and written reminders to the borrower and other persons listed in the contact list.
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation
        onNavigate={onNavigate}
        currentScreen="howtopay"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 0,
    paddingBottom: 100,
  },
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 0,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  grayContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  grayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  grayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  grayLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    width: 120,
  },
  grayValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  alertContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 20,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  exclamationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFC107",
    justifyContent: "center",
    alignItems: "center",
  },
  exclamationText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  alertText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
});

export default HowToPayPage;