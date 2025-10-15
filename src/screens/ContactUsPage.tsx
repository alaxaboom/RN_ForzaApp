import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavigation from '../utils/BottomNavigation';
import { Screen } from '../types/index';

type NavigationProps = {
  onNavigate: (screen: Screen, params?: any) => void;
};

const ContactUsPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const handleCallMeBack = () => {
    onNavigate("callback");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Contact us</Text>
          <Text style={styles.subtitle}>Contact center is available 24 hours a day</Text>
        </View>

        <View style={styles.groupedContainer}>
          <View style={styles.groupedContactItem}>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={23} color="#666" />
              <Text style={styles.contactLabel}>Call us</Text>
            </View>
            <View style={styles.contactValueContainer}>
              <Text style={styles.contactValue}>12019011</Text>
              <Ionicons name="chevron-forward" size={19} color="#999" />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.groupedContactItem}>
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={23} color="#666" />
              <Text style={styles.contactLabel}>Email</Text>
            </View>
            <View style={styles.contactValueContainer}>
              <Text style={styles.contactValue}>Info@forza.ba</Text>
              <Ionicons name="chevron-forward" size={19} color="#999" />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.groupedContactItem}>
            <View style={styles.contactRow}>
              <Ionicons name="chatbubble-outline" size={23} color="#666" />
              <Text style={styles.contactLabel}>Viber</Text>
            </View>
            <View style={styles.contactValueContainer}>
              <Text style={styles.contactValue}>forzafinance</Text>
              <Ionicons name="chevron-forward" size={19} color="#999" />
            </View>
          </View>
        </View>

        <View style={styles.contactItem}>
          <View style={styles.contactRow}>
            <Ionicons name="heart" size={23} color="#FF4081" />
            <Text style={styles.contactLabel}>Recommend app</Text>
          </View>
          <Ionicons name="chevron-forward" size={19} color="#999" />
        </View>

        <View style={styles.contactItem}>
          <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={23} color="#666" />
            <Text style={styles.contactLabel}>Locations</Text>
          </View>
          <View style={styles.contactValueContainer}>
            <Text style={styles.contactValue}>12019011</Text>
            <Ionicons name="chevron-forward" size={19} color="#999" />
          </View>
        </View>

        <View style={styles.contactItem}>
          <View style={styles.contactRow}>
            <Ionicons name="logo-facebook" size={23} color="#666" />
            <Text style={styles.contactLabel}>Facebook</Text>
          </View>
          <View style={styles.contactValueContainer}>
            <Text style={styles.contactValue}>forzafinance</Text>
            <Ionicons name="chevron-forward" size={19} color="#999" />
          </View>
        </View>

        <TouchableOpacity style={styles.callBackButton} onPress={handleCallMeBack}>
          <Text style={styles.callBackButtonText}>Call me back</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation onNavigate={onNavigate} currentScreen="contacts" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 26,
    paddingTop: 46,
    marginBottom: 30,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
  },
  groupedContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  groupedContactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 19,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
  contactItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 30,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 18,
    marginLeft: 11,
    color: '#333',
  },
  contactValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactValue: {
    fontSize: 16,
    marginRight: 11,
    color: '#333',
  },
  callBackButton: {
    backgroundColor: '#00C853',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 15,
    paddingHorizontal: 19,
    borderRadius: 8,
    alignItems: 'center',
  },
  callBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default ContactUsPage;