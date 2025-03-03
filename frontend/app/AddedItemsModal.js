import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { calculateTotalCost, PRICES } from './utils'; // Import both functions

const screenWidth = Dimensions.get('window').width;

// Custom Color Palette
const COLORS = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'];

const AddedItemsModal = ({ visible, onClose, addedItems }) => {
  // Prepare data for charts (unchanged)
  const totalProductCost = addedItems.reduce(
    (sum, item) => {
      const source = item.name.replace(/\s+/g, '').toLowerCase(); // Normalize the source key
      const prices = PRICES[source];
      return sum + (prices ? prices.productCost * item.quantity : 0);
    },
    0
  );

  const totalInstallationCost = addedItems.reduce(
    (sum, item) => {
      const source = item.name.replace(/\s+/g, '').toLowerCase(); // Normalize the source key
      const prices = PRICES[source];
      return sum + (prices ? prices.installation * item.quantity : 0);
    },
    0
  );

  const totalMaintenanceCost = addedItems.reduce(
    (sum, item) => {
      const source = item.name.replace(/\s+/g, '').toLowerCase(); // Normalize the source key
      const prices = PRICES[source];
      return sum + (prices ? prices.maintenance * item.quantity : 0);
    },
    0
  );

  const pieChartData = [
    { name: 'Product Cost', value: totalProductCost, color: COLORS[0], legendFontColor: '#FFFFFF', legendFontSize: 10 },
    { name: 'Installation Cost', value: totalInstallationCost, color: COLORS[1], legendFontColor: '#FFFFFF', legendFontSize: 10 },
    { name: 'Maintenance Cost', value: totalMaintenanceCost, color: COLORS[2], legendFontColor: '#FFFFFF', legendFontSize: 10 },
  ];

  const barChartData = {
    labels: addedItems.map(item => item.name),
    datasets: [
      {
        data: addedItems.map(item =>
          calculateTotalCost(item.name.replace(/\s+/g, '').toLowerCase(), item.quantity).totalCost
        ),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green for Total Cost
        strokeWidth: 2,
      },
      {
        data: addedItems.map(item =>
          calculateTotalCost(item.name.replace(/\s+/g, '').toLowerCase(), item.quantity).annualSavings
        ),
        color: (opacity = 1) => `rgba(139, 195, 74, ${opacity})`, // Lighter green for Annual Savings
        strokeWidth: 2,
      },
    ],
    legend: ['Total Cost', 'Annual Savings'],
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        {/* Expanded Modal Container */}
        <View style={[styles.modalContainer, styles.shadow]}>
          {/* Wrap the content in a ScrollView */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
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
                      {item.name} - {PRICES[source]?.type || 'Unknown'}
                    </Text>

                    {/* Analysis Data */}
                    <Text style={styles.smallText}>Cost: ₱{analysisData.totalCost.toFixed(2)}</Text>
                    <Text style={styles.smallText}>Savings: ₱{analysisData.annualSavings.toFixed(2)}</Text>
                    <Text style={styles.smallText}>
                      Payback:{' '}
                      {isNaN(analysisData.paybackPeriod) || analysisData.paybackPeriod === null
                        ? '0yr'
                        : `${analysisData.paybackPeriod.toFixed(1)}yr`}
                    </Text>
                    <Text style={styles.smallText}>CO₂: {analysisData.totalCarbonEmissions}kg</Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.smallText}>No items added.</Text>
            )}

            {/* Charts Section */}
            <View style={styles.chartSection}>
              {/* Pie Chart for Cost Breakdown */}
              <Text style={styles.chartTitle}>Cost Breakdown</Text>
              <PieChart
                data={pieChartData}
                width={screenWidth - 60} // Same width as before
                height={200} // Same height as before
                chartConfig={{
                  backgroundColor: '#1A1A40',
                  backgroundGradientFrom: '#1A1A40',
                  backgroundGradientTo: '#1A1A40',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White text for labels
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White text for labels
                  style: {
                    borderRadius: 8,
                  },
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="10"
                absolute
              />

              {/* Bar Chart for Cost vs. Savings */}
              <Text style={styles.chartTitle}>Cost vs. Savings</Text>
              <BarChart
  data={barChartData}
  width={screenWidth - 100} // Adjust width as needed
  height={250} // Adjust height as needed
  yAxisLabel="₱"
  chartConfig={{
    backgroundColor: '#1A1A40', // Dark background
    backgroundGradientFrom: '#1A1A40',
    backgroundGradientTo: '#1A1A40',
    decimalPlaces: 1, // Number of decimal places for labels
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White text for labels
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White text for labels
    barPercentage: 0.6, // Thicker bars
    style: {
      borderRadius: 8, // Rounded corners
    },
  }}
  verticalLabelRotation={30} // Rotate labels for better readability
/>
            </View>

            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '95%',
    maxHeight: '95%',
    backgroundColor: '#1A1A40', // Updated background color
    borderRadius: 8,
    padding: 10, // Retained minimal padding
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 16, // Retained smaller header size
    fontWeight: 'bold',
    color: '#4CAF50', // Updated text color
    marginBottom: 5, // Retained minimal margin
    textAlign: 'center',
  },
  itemContainer: {
    marginBottom: 5, // Retained minimal margin
    padding: 5, // Retained minimal padding
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)', // Updated border color
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#1A1A40', // Updated background color
  },
  itemName: {
    fontSize: 12, // Retained smaller font size
    fontWeight: 'bold',
    color: '#4CAF50', // Updated text color
    marginBottom: 2, // Retained minimal margin
  },
  smallText: {
    fontSize: 10, // Retained very small font size
    color: '#FFFFFF', // Updated text color to white
    marginBottom: 1, // Retained minimal margin
  },
  button: {
    backgroundColor: '#4CAF50', // Updated button color
    padding: 8, // Retained minimal padding
    borderRadius: 4,
    marginTop: 8, // Retained minimal margin
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // Updated text color
    fontWeight: 'bold',
    fontSize: 14, // Retained smaller font size
  },
  chartSection: {
    marginTop: 9, // Retained minimal margin
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 14, // Retained smaller font size
    fontWeight: 'bold',
    color: '#4CAF50', // Title remains green
    marginBottom: 5, // Retained minimal margin
    textAlign: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default AddedItemsModal;