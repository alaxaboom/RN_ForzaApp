import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

type ConfirmationScreenProps = {
  onDone: () => void;
};

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ onDone }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={48} color="#00C853" />
        </View>
        <Text style={styles.title}>Application successfully accepted</Text>
        <Text style={styles.description}>
          Thank you for filling out the application, it is already being processed and we will contact you within 15 minutes for more information.
        </Text>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepItem, styles.stepItemActive]}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Ionicons name="apps" size={20} color="white" />
            </View>
          </View>
          <View style={[styles.stepConnector, styles.stepConnectorActive]} />
          <View style={[styles.stepItem, styles.stepItemActive]}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Ionicons name="calculator" size={20} color="white" />
            </View>
          </View>
          <View style={[styles.stepConnector, styles.stepConnectorActive]} />
          <View style={[styles.stepItem, styles.stepItemActive]}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Ionicons name="person" size={20} color="white" />
            </View>
          </View>
          <View style={[styles.stepConnector, styles.stepConnectorActive]} />
          <View style={[styles.stepItem, styles.stepItemActive]}>
            <View style={[styles.stepCircle, styles.stepCircleCurrent]}>
              <Ionicons name="checkmark" size={20} color="#00C853" />
            </View>
          </View>
        </View>
        <Text style={styles.stepText}>Step 4 of 4 • Wait for the call</Text>
      </View>
      <TouchableOpacity style={styles.doneButton} onPress={onDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepItemActive: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#00C853',
  },
  stepCircleCurrent: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#00C853',
  },
  stepConnector: {
    height: 2,
    backgroundColor: '#e0e0e0',
    flex: 1,
    marginHorizontal: 0,
    marginTop: -25,
  },
  stepConnectorActive: {
    backgroundColor: '#00C853',
  },
  stepText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#00C853',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConfirmationScreen;