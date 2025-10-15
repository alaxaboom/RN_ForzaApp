// screens/ProfilePage.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Switch,
  Image,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from "../hooks/useAuth";
import { useSmartNavigation } from "../utils/navigation";
import { useAppSelector } from "../store/store";
import { useGetUserByIdQuery } from "../store/api";
import BottomNavigation from "../utils/BottomNavigation";

type NavigationProps = {
  onNavigate: (screen: "home" | "login" | "firstpage") => void;
};

const ProfilePage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const { user, logout, updateProfile } = useAuth();
  const { navigateToHomeOrFirst } = useSmartNavigation();
  const [isSwitchOnPhone, setIsSwitchOnPhone] = useState(true);
  const [isSwitchOnEmail, setIsSwitchOnEmail] = useState(true);
  const [editField, setEditField] = useState<'email' | 'phone' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const { data: userDetails, isLoading, isError, refetch } = useGetUserByIdQuery(user?.id || '', {
    skip: !user?.id,
  });

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            logout();
            onNavigate("firstpage");
          },
        },
      ]
    );
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("387")) {
      return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8, 11)}`;
    }
    return `+${cleaned}`;
  };

  const renderAvatarPlaceholder = () => (
    <View style={styles.avatarPlaceholder}>
      <Ionicons name="camera" size={24} color="#999" />
    </View>
  );

  const renderAvatar = () => {
    if (!userDetails?.avatar) {
      return renderAvatarPlaceholder();
    }
    return (
      <Image
        source={{ uri: userDetails.avatar }}
        style={styles.avatar}
        resizeMode="cover"
      />
    );
  };

  const openEditModal = (field: 'email' | 'phone') => {
    setEditField(field);
    setEditValue(field === 'email' ? userDetails?.email || '' : userDetails?.phone || '');
  };

  const closeEditModal = () => {
    setEditField(null);
    setEditValue('');
  };

  const handleUpdate = async () => {
    if (!userDetails?.id) return;
    const updatedData: any = {};
    if (editField === 'email') {
      updatedData.email = editValue;
    } else if (editField === 'phone') {
      updatedData.phone = editValue;
    }
    const result = await updateProfile(updatedData);
    if (result.success) {
      refetch();
      closeEditModal();
    } else {
      Alert.alert("Error", result.error || "Failed to update");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text>Error loading profile</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          {renderAvatar()}
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Personal data</Text>

            <View style={styles.infoRowHorizontal}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{userDetails?.firstName || "not yet added"}</Text>
            </View>

            <View style={styles.infoRowHorizontal}>
              <Text style={styles.infoLabel}>Last name</Text>
              <Text style={styles.infoValue}>{userDetails?.lastName || "not yet added"}</Text>
            </View>

            <View style={styles.infoRowHorizontal}>
              <Text style={styles.infoLabel}>JMBG</Text>
              <Text style={styles.infoValue}>
                {userDetails?.jmbg ? userDetails.jmbg.replace(/(\d{4})(\d{4})(\d{4})(\d{1})/, "$1 $2 $3 $4") : "not yet added"}
              </Text>
            </View>

            <View style={styles.infoRowVertical}>
              <Text style={styles.infoLabel}>Email</Text>
              <View style={styles.editableValueContainer}>
                <Text style={styles.infoValue}>{userDetails?.email || "not yet added"}</Text>
                <TouchableOpacity onPress={() => openEditModal('email')}>
                  <View style={styles.editIconContainer}>
                    <Ionicons name="create-outline" size={16} color="#333" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoRowVertical}>
              <Text style={styles.infoLabel}>Phone number</Text>
              <View style={styles.editableValueContainer}>
                <Text style={styles.infoValue}>
                  {userDetails?.phone ? formatPhone(userDetails.phone) : "not yet added"}
                </Text>
                <TouchableOpacity onPress={() => openEditModal('phone')}>
                  <View style={styles.editIconContainer}>
                    <Ionicons name="create-outline" size={16} color="#333" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoRowVertical}>
              <Text style={styles.infoLabel}>Residential address</Text>
              <Text style={styles.infoValue}>{userDetails?.residentialAddress || "not yet added"}</Text>
            </View>

            <View style={styles.profilePictureSection}>
              <Text style={styles.profilePictureLabel}>Profile picture</Text>
              <TouchableOpacity style={styles.addPhotoButton} onPress={() => setShowPhotoModal(true)}>
                <Text style={styles.addPhotoButtonText}>+ Add photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <View style={styles.settingRow}>
              <Switch
                value={isSwitchOnPhone}
                onValueChange={setIsSwitchOnPhone}
                trackColor={{ false: '#767577', true: '#00C853' }}
                thumbColor={isSwitchOnPhone ? '#fff' : '#f4f3f4'}
              />
              <Text style={styles.settingLabel}>Receive marketing offers on my phone</Text>
            </View>

            <View style={styles.settingRow}>
              <Switch
                value={isSwitchOnEmail}
                onValueChange={setIsSwitchOnEmail}
                trackColor={{ false: '#767577', true: '#00C853' }}
                thumbColor={isSwitchOnEmail ? '#fff' : '#f4f3f4'}
              />
              <Text style={styles.settingLabel}>Receive marketing offers to my email</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavigation
        onNavigate={(screen, params) => {
          if (screen === "home") {
            if (user) {
              onNavigate("home");
            } else {
              onNavigate("firstpage");
            }
          } else {
            console.log(`Navigate to: ${screen}`);
          }
        }}
        currentScreen="profile"
      />

      {/* Edit Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={!!editField}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={styles.modalDragBar} />
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={editField === 'email' ? 'Enter email' : 'Enter phone number'}
              keyboardType={editField === 'email' ? 'email-address' : 'phone-pad'}
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={closeEditModal}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalUpdateButton} onPress={handleUpdate}>
                <Text style={styles.modalUpdateText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Photo Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={showPhotoModal}
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.photoModal}>
            <View style={styles.modalDragBar} />
            <TouchableOpacity style={styles.photoModalButton}>
              <Text style={styles.photoModalButtonText}>Take a photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoModalButton}>
              <Text style={styles.photoModalButtonText}>Choose from gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoModalButton}>
              <Text style={styles.photoModalButtonText}>Choose from files</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoModalCancelButton} onPress={() => setShowPhotoModal(false)}>
              <Text style={styles.photoModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "600",
    color: "#333",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  section: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  infoRowHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoRowVertical: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLabel: {
    fontSize: 18,
    color: "#999",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  editableValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingLabel: {
    fontSize: 18,
    color: "#999",
    fontWeight: "500",
    flex: 1,
    marginLeft: 12,
  },
  addPhotoButton: {
    backgroundColor: "#FFF5E6",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  addPhotoButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  editModal: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  photoModal: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modalDragBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  modalUpdateButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#00C853',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalUpdateText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  photoModalButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  photoModalButtonText: {
    fontSize: 16,
    color: '#333',
  },
  photoModalCancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  photoModalCancelText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  profilePictureSection: {
    marginTop: 16,
  },
  profilePictureLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    marginBottom: 8,
  },
});

export default ProfilePage;