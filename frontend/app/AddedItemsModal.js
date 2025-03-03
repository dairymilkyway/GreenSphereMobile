import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { calculateTotalCost } from './utils'; // Import the utility function

const AddedItemsModal = ({ visible, onClose, addedItems }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <Text style={styles.modalHeader}>Techno-Economic Analysis</Text>

          {/* List of Added Items */}
          {addedItems.length > 0 ? (
            addedItems.map((item, index) => {
              const source = item.name.replace(/\s+/g, '').toLowerCase(); // Normalize the source key
              const analysisData = calculateTotalCost(source, item.quantity); // Use the imported calculateTotalCost function

              return (
                <View key={index} style={styles.itemContainer}>
                  {/* Item Name and Type */}
                  <Text style={styles.itemName}>
                    {item.name} - Type: {item.type} 
                  </Text>

                  {/* Analysis Data */}
                  <Text>Total Cost: ₱{analysisData.totalCost.toFixed(2)}</Text>
                  <Text>Annual Savings: ₱{analysisData.annualSavings.toFixed(2)}</Text>
                  <Text>
                    Payback Period:{' '}
                    {isNaN(analysisData.paybackPeriod) || analysisData.paybackPeriod === null
                      ? '0 year'
                      : `${analysisData.paybackPeriod.toFixed(2)} years`}
                  </Text>
                  <Text>Total Carbon Emissions: {analysisData.totalCarbonEmissions} kg CO₂</Text>
                </View>
              );
            })
          ) : (
            <Text>No items have been added yet.</Text>
          )}

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: '100%',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddedItemsModal;