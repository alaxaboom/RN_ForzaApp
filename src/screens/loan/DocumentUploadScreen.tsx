import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

type DocumentUploadScreenProps = {
  uploadedDocuments: string[];
  setUploadedDocuments: (docs: string[]) => void;
  onSkip: () => void;
  onContinue: () => void;
};

const DocumentUploadScreen: React.FC<DocumentUploadScreenProps> = ({
  uploadedDocuments,
  setUploadedDocuments,
  onSkip,
  onContinue,
}) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isSourceModalVisible, setIsSourceModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showDocumentList, setShowDocumentList] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const documentOptions = [
    "ID card (front and back)",
    "Income proof (salary slip, not older than one year)",
    "Residential confirmation (e.g. utility bill)"
  ];

  const handleAddDocument = () => {
    setIsAddModalVisible(true);
  };

  const handleSelectDocument = (doc: string) => {
    setSelectedDocument(doc);
  };

  const handleContinueFromModal = () => {
    if (selectedDocument) {
      setIsAddModalVisible(false);
      setIsSourceModalVisible(true);
    }
  };

  const handleSourceSelection = (source: string) => {
    if (selectedDocument) {
      const fileName = selectedDocument.split(' ')[0].replace(/\W/g, '') + '.pdf';
      setUploadedDocuments([...uploadedDocuments, `${fileName}`]);
    }
    setIsSourceModalVisible(false);
  };

  const handleRemoveDocument = (index: number) => {
    const newDocs = [...uploadedDocuments];
    newDocs.splice(index, 1);
    setUploadedDocuments(newDocs);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Additional documents can help us give you a higher limit or better terms.
      </Text>

      <View style={styles.documentList}>
        {documentOptions.map((doc, index) => (
          <View key={index} style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#999" />
            <Text style={styles.listItemText}>{doc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity 
          style={[styles.checkbox, isChecked && styles.checkboxChecked]}
          onPress={() => setIsChecked(!isChecked)}
        >
          {isChecked && <Ionicons name="checkmark" size={14} color="white" />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          The mForza app requires certain documents to assess credit risk and speed up loan disbursement. The documents you upload will be collected and analyzed as part of the credit-risk evaluation process. By uploading your documents, you consent to their use for this purpose
        </Text>
      </View>

      {uploadedDocuments.length > 0 && (
        <>
          <Text style={styles.uploadedTitle}>Uploaded documents</Text>
          <View style={styles.uploadedList}>
            {uploadedDocuments.map((doc, index) => (
              <View key={index} style={styles.uploadedItem}>
                <Ionicons name="document" size={20} color="#666" />
                <Text style={styles.uploadedName}>{doc}</Text>
                <Text style={styles.uploadedSize}>29KB</Text>
                <TouchableOpacity onPress={() => handleRemoveDocument(index)}>
                  <Ionicons name="close" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddDocument}>
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.addButtonText}>Add documents</Text>
      </TouchableOpacity>

      <View style={styles.bottomButtonContainer}>
        {uploadedDocuments.length === 0 ? (
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.continueButton, !isChecked && styles.continueButtonDisabled]} 
            onPress={isChecked ? onContinue : undefined}
            disabled={!isChecked}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Optional documents</Text>
            <Text style={styles.modalSubtitle}>
              Additional documents can help us give you a higher limit or better terms.
            </Text>

            <TouchableOpacity 
              style={styles.dropdownButton} 
              onPress={() => setShowDocumentList(!showDocumentList)}
            >
              <Text style={styles.dropdownText}>
                {selectedDocument || "ID card (front and back)"}
              </Text>
              <Ionicons 
                name={showDocumentList ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>

            {showDocumentList && (
              <ScrollView style={styles.dropdownList}>
                {documentOptions.map((doc, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.dropdownItem}
                    onPress={() => {
                      handleSelectDocument(doc);
                      setShowDocumentList(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{doc}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity 
              style={styles.modalContinueButton} 
              onPress={handleContinueFromModal}
            >
              <Text style={styles.modalContinueButtonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={() => setIsAddModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isSourceModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSourceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.sourceOption}
              onPress={() => handleSourceSelection("gallery")}
            >
              <Text style={styles.sourceOptionText}>Choose from gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.sourceOption}
              onPress={() => handleSourceSelection("files")}
            >
              <Text style={styles.sourceOptionText}>Choose from files</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setIsSourceModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  documentList: {
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  listItemText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ff9999",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#ff9999",
    borderColor: "#ff9999",
  },
  checkboxText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    lineHeight: 20,
  },
  uploadedTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  uploadedList: {
    marginBottom: 20,
  },
  uploadedItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
  },
  uploadedName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  uploadedSize: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#00C853",
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  bottomButtonContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  skipButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  continueButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#00C853",
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  continueButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownList: {
    width: "100%",
    maxHeight: 200,
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalContinueButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#00C853",
    borderRadius: 8,
    marginBottom: 12,
  },
  modalContinueButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  modalCancelButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    textAlign: "center",
  },
  sourceOption: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 12,
  },
  sourceOptionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default DocumentUploadScreen;