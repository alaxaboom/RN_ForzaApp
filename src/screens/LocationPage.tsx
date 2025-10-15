// src/screens/LocationPage.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSmartNavigation } from '../utils/navigation';
import { Screen } from '../types/index';

type NavigationProps = {
  onNavigate: (screen: Screen, params?: any) => void;
};

const LocationPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('map');
  const { navigateToHomeOrFirst } = useSmartNavigation();
  
  const handleBack = () => {
    navigateToHomeOrFirst(onNavigate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Locations</Text>
        <View style={styles.searchIcon}>
          <Ionicons name="search" size={24} color="#333" />
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'map' && styles.activeTab]}
          onPress={() => setActiveTab('map')}
        >
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>List</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.placeholderText}>Interactive map will be here</Text>
          <Text style={styles.placeholderSubtext}>Currently under development</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  searchIcon: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#00C853',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default LocationPage;