import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { calculateTotalCost, PRICES } from './utils'; // Import both functions
import axios from 'axios';
import ViewShot from "react-native-view-shot";
import { useRef } from "react";
import exportToPDF from "./ExportToPDF";
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Custom Color Palette
const COLORS = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'];


const AddedItemsModal = ({ visible, onClose, addedItems, onRemoveItem  }) => {
  const costBenefitRef = useRef(null);
  const savingsRef = useRef(null);
  const carbonRef = useRef(null);
  const carbonRef1 = useRef(null);
  const energyUsageRef = useRef(null);
  const totalCostRef = useRef(null);
  const costBreakdownRef = useRef(null);
  const [isSaveSuccessful, setIsSaveSuccessful] = React.useState(false);

  const calculateCumulativePaybackPeriod = (items) => {
    let totalCost = 0;
    let totalAnnualSavings = 0;
  
    items.forEach(item => {
      const source = item.name.replace(/\s+/g, '').toLowerCase();
      const { totalCost: itemCost, annualSavings: itemSavings } = calculateTotalCost(source, item.quantity);
      totalCost += itemCost;
      totalAnnualSavings += itemSavings;
    });
  
    return totalAnnualSavings > 0 ? totalCost / totalAnnualSavings : null; // Avoid division by zero
  };
  // Prepare data for charts
  const totalProductCost = addedItems.reduce((sum, item) => {
    const source = item.name.replace(/\s+/g, '').toLowerCase();
    const prices = PRICES[source];
    return sum + (prices ? prices.productCost * item.quantity : 0);
  }, 0);

  const totalInstallationCost = addedItems.reduce((sum, item) => {
    const source = item.name.replace(/\s+/g, '').toLowerCase();
    const prices = PRICES[source];
    return sum + (prices ? prices.installation * item.quantity : 0);
  }, 0);

  const totalMaintenanceCost = addedItems.reduce((sum, item) => {
    const source = item.name.replace(/\s+/g, '').toLowerCase();
    const prices = PRICES[source];
    return sum + (prices ? prices.maintenance * item.quantity : 0);
  }, 0);

  const totalCarbonEmissions = addedItems.reduce((sum, item) => {
    const source = item.name.replace(/\s+/g, '').toLowerCase();
    const prices = PRICES[source];
    return sum + (prices ? prices.carbonEmissions * item.quantity : 0);
  }, 0);

  const handleRemoveItem = (index) => {
    const updatedItems = addedItems.filter((_, i) => i !== index);
    onRemoveItem(updatedItems); // Call the parent's callback to update the state
  };

  const carbonPaybackPeriod = (totalCarbonEmissions / 1000).toFixed(2); // Example calculation

  const energyUsageByType = addedItems.reduce((acc, item) => {
    const source = item.name.replace(/\s+/g, '').toLowerCase();
    const prices = PRICES[source];
    if (prices) {
      acc[source] = (acc[source] || 0) + prices.energyProduction * item.quantity;
    }
    return acc;
  }, {});

  const pieChartData = [
    { name: 'Product Cost', value: totalProductCost, color: COLORS[0], legendFontColor: '#000', legendFontSize: 10 },
    { name: 'Installation Cost', value: totalInstallationCost, color: COLORS[1], legendFontColor: '#000', legendFontSize: 10 },
    { name: 'Maintenance Cost', value: totalMaintenanceCost, color: COLORS[2], legendFontColor: '#000', legendFontSize: 10 },
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

  const lineChartData = addedItems.map(item => ({
    name: item.name,
    emissions: calculateTotalCost(item.name.replace(/\s+/g, '').toLowerCase(), item.quantity).totalCarbonEmissions,
  }));

  const totalCost = totalProductCost + totalInstallationCost + totalMaintenanceCost;

  const carbonByItem = addedItems.map(item => {
    const source = item.name.replace(/\s+/g, '').toLowerCase();
    const prices = PRICES[source] || {}; // Fallback to an empty object if PRICES[source] is undefined
    const emissions = (prices.carbonEmissions || 0) * (item.quantity || 0); // Handle missing values
    const payback = emissions / 100; // Example calculation
  
    return {
      name: item.name,
      emissions: emissions,
      payback: payback,
    };
  }) || []; // Fallback to an empty array if mapping fails
  
  // Debugging logs
  console.log('addedItems:', addedItems);
  console.log('PRICES:', PRICES);
  console.log('carbonByItem:', carbonByItem);
  
  // Calculate total carbon emissions and total payback period using a for loop
  let totalEmissions = 0;
  let totalPayback = 0;
  
  for (let i = 0; i < carbonByItem.length; i++) {
    totalEmissions += carbonByItem[i].emissions;
    totalPayback += carbonByItem[i].payback;
  }
  
  // Data for Total Carbon Emissions Chart (single bar)
  const emissionsBarChartData = {
    labels: ['Total Carbon Emissions'], // Single label for the aggregated bar
    datasets: [
      {
        data: [totalEmissions], // Aggregated total emissions
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red for emissions
      },
    ],
  };
  
  // Data for Carbon Payback Period Chart (single bar)
  const paybackBarChartData = {
    labels: ['Carbon Payback Period'], // Single label for the aggregated bar
    datasets: [
      {
        data: [totalPayback], // Aggregated total payback period
        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Blue for payback
      },
    ],
  };

  const fetchUserData = async () => { 
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error("Token not found in AsyncStorage.");
        return null;
      }
  
      const response = await fetch('http://192.168.0.251:8082/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        console.error("Backend returned error:", response.status, response.statusText);
        return null;
      }
  
      const data = await response.json();
      console.log("ðŸ“¥ Full Backend Response:", data); // Log the full response
      console.log("ðŸ“¥ User Data Extracted:", data.user); // Log the extracted user data
      return data.user;
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
  };
  // Define saveData function within the component to access these variables
  const saveData = async () => {
    const token = await AsyncStorage.getItem('token');
    
    try {
      // Fetch logged-in user ID from the backend
      const userResponse = await fetch("http://192.168.0.251:8082/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
        credentials: "include", // Required to send cookies/session data
      });
  
      if (!userResponse.ok) {
        throw new Error("Failed to fetch logged-in user.");
      }
  
      const userData = await userResponse.json();
  
      // Debugging: Log the entire userData object
      console.log("🛠 Debug: User Data from Backend:", userData);
  
      // Validate the presence of the user ID in the nested structure
      const userIdField = userData?.user?._id || userData?.user?.userId;
      if (!userIdField) {
        throw new Error("User ID is missing or undefined in the backend response.");
      }
  
      const user_id = userIdField; // Extract user ID
      console.log("✅ Logged-in User ID:", user_id);
  
      // Debugging: Log other variables
      console.log("🛠 Debug: Total Product Cost:", totalProductCost);
      console.log("🛠 Debug: Total Installation Cost:", totalInstallationCost);
      console.log("🛠 Debug: Total Maintenance Cost:", totalMaintenanceCost);
      console.log("🛠 Debug: Carbon Payback Period:", carbonPaybackPeriod);
      console.log("🛠 Debug: Total Carbon Emissions:", totalCarbonEmissions);
      console.log("🛠 Debug: Energy Usage Data:", energyUsageByType);
  
      // Prepare data
      const costAnalysisData = {
        user_id,
        TotalProductCost: parseFloat(totalProductCost),
        TotalInstallationCost: parseFloat(totalInstallationCost),
        TotalMaintenanceCost: parseFloat(totalMaintenanceCost),
      };
  
      const carbonAnalysisData = {
        user_id,
        CarbonPaybackPeriod: parseFloat(carbonPaybackPeriod),
        TotalCarbonEmission: parseFloat(totalCarbonEmissions),
      };
  
      // Filter out zero-emission energy sources
      const energyUsageData = Object.entries(energyUsageByType)
        .filter(([type, emissions]) => emissions > 0)
        .map(([type, emissions]) => ({
          user_id,
          Type: type,
          Emissions: parseFloat(emissions),
        }));
  
      console.log("📩 Sending Cost Analysis:", costAnalysisData);
      console.log("📩 Sending Carbon Analysis:", carbonAnalysisData);
      console.log("📩 Sending Filtered Energy Usage:", energyUsageData);
  
      // Send requests
      const costResponse = await fetch("http://192.168.0.251:8082/api/cost-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(costAnalysisData),
      });
  
      const carbonResponse = await fetch("http://192.168.0.251:8082/api/carbon-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carbonAnalysisData),
      });
  
      const costData = await costResponse.json();  // ✅ Read once
      const carbonData = await carbonResponse.json();  // ✅ Read once
  
      console.log("✅ Cost Analysis Response:", costData);
      console.log("✅ Carbon Analysis Response:", carbonData);
  
      // Send energy usage requests in parallel
      const energyUsageResponses = await Promise.all(
        energyUsageData.map((entry) =>
          fetch("http://192.168.0.251:8082/api/energy-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          }).then((res) => res.json()) // Read response once
        )
      );
      setIsSaveSuccessful(true);
      console.log("Data saved successfully");
      console.log("✅ Energy Usage Responses:", energyUsageResponses);
  
    } catch (error) {
      console.error("❌ Error saving data:", error);
      alert("Failed to save data.");
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
        <Modal
      transparent
      visible={isSaveSuccessful}
      animationType="fade"
      onRequestClose={() => setIsSaveSuccessful(false)}
    >
      <View style={styles.successModalOverlay}>
        <View style={styles.successModalContainer}>
          <Text style={styles.successMessage}>Data Successfully Saved on the Database</Text>
          <TouchableOpacity 
            style={styles.successButton}
            onPress={() => setIsSaveSuccessful(false)}
          >
            <Text style={styles.successButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
      <View style={styles.modalOverlay}>
        {/* Expanded Modal Container */}
        <View style={[styles.modalContainer, styles.shadow]}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.modalHeader}>Techno-Economic Analysis</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Wrap the content in a ScrollView */}
          
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ViewShot ref={costBenefitRef} options={{ format: "jpg", quality: 0.9 }}>
  {/* Cost vs. Benefit Analysis */}
  <View style={styles.section}>
    <Text style={styles.chartTitle}>Cost vs. Benefit Analysis</Text>
    <View style={styles.analysisContainer}>
      {addedItems.length > 0 ? (
        addedItems.map((item, index) => {
          const source = item.name.replace(/\s+/g, '').toLowerCase();
          const analysisData = calculateTotalCost(source, item.quantity);
          return (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetail}>Total Cost: ₱{analysisData.totalCost.toFixed(2)}</Text>
              <Text style={styles.itemDetail}>Annual Savings: ₱{analysisData.annualSavings.toFixed(2)}</Text>
              <Text style={styles.itemDetail}>
                Payback Period:{' '}
                {isNaN(analysisData.paybackPeriod) || analysisData.paybackPeriod === null
                  ? '0yr'
                  : `${analysisData.paybackPeriod.toFixed(1)}yr`}
              </Text>
              {/* Remove Button */}
              <TouchableOpacity
                onPress={() => onRemoveItem(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <Text style={styles.noItemsText}>No items added.</Text>
      )}
    </View>
  </View>
</ViewShot>

            {/* Bar Chart for Cost vs. Savings */}
            <ViewShot ref={savingsRef} options={{ format: "jpg", quality: 0.9 }}>
  <View style={styles.chartSection}>
    <Text style={styles.chartTitle}>Cost vs. Savings Comparison</Text>
    <View style={styles.chartContainer}>
      <BarChart
        data={barChartData}
        width={screenWidth * 0.9}
        height={300}
        yAxisLabel="₱"
        chartConfig={{
          backgroundColor: '#1A1A40',
          backgroundGradientFrom: '#1E1E50',
          backgroundGradientTo: '#1A1A40',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          barPercentage: 0.7,
          propsForLabels: {
            fontSize: addedItems.length <= 3 ? 12 : 8, // Adjust font size dynamically
          },
          propsForVerticalLabels: {
            fontSize: addedItems.length <= 3 ? 12 : 8, // Adjust font size dynamically
          },
        }}
        style={styles.chart}
        verticalLabelRotation={0} // Horizontal labels
        showValuesOnTopOfBars={true}
        fromZero={true} // Ensure bars start from zero
      />
    </View>
  </View>
</ViewShot>
{/* Bar Charts for Carbon Emissions and Payback Period */}
<ViewShot ref={carbonRef} options={{ format: "jpg", quality: 0.9 }}>
  <View style={styles.chartSection}>
    {/* Header Section */}
    <Text style={styles.chartTitle}>Carbon Payback Period Analysis</Text>

    {/* Total Carbon Emissions Chart */}
    <View style={[styles.chartContainer, { marginBottom: 20 }]}>
      <Text style={styles.chartTitle}>Total Carbon Emissions (kg CO₂)</Text>
      <BarChart
        data={emissionsBarChartData} // Use emissionsBarChartData here
        width={screenWidth * 0.45} // Adjusted width for better alignment
        height={300}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#1A1A40',
          backgroundGradientFrom: '#1E1E50',
          backgroundGradientTo: '#1A1A40',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          barPercentage: 0.85, // Slightly wider bars for prominence
          barRadius: 5, // Rounded edges for visual appeal
          propsForLabels: { fontSize: 12, textAlign: 'center' }, // Larger font size for readability
        }}
        style={[styles.chart, { alignSelf: 'center' }]} // Center the chart
        verticalLabelRotation={0} // Horizontal labels
        showValuesOnTopOfBars={true}
        fromZero={true} // Ensure bars start from zero
      />
    </View>
  </View>
</ViewShot>

{/* Carbon Payback Period Chart */}
<ViewShot ref={carbonRef1} options={{ format: "jpg", quality: 0.9 }}>
  <View style={[styles.chartContainer, { marginTop: 20 }]}>
    <Text style={styles.chartTitle}>Carbon Payback Period (years)</Text>
    <BarChart
      data={paybackBarChartData} // Use paybackBarChartData here
      width={screenWidth * 0.45} // Adjusted width for better alignment
      height={300}
      yAxisLabel=""
      chartConfig={{
        backgroundColor: '#1A1A40',
        backgroundGradientFrom: '#1E1E50',
        backgroundGradientTo: '#1A1A40',
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        barPercentage: 0.85, // Slightly wider bars for prominence
        barRadius: 5, // Rounded edges for visual appeal
        propsForLabels: { fontSize: 12, textAlign: 'center' }, // Larger font size for readability
      }}
      style={[styles.chart, { alignSelf: 'center' }]} // Center the chart
      verticalLabelRotation={0} // Horizontal labels
      showValuesOnTopOfBars={true}
      fromZero={true} // Ensure bars start from zero
    />
  </View>
</ViewShot>

            {/* Energy Usage Section */}
            <ViewShot ref={energyUsageRef} options={{ format: "jpg", quality: 0.9 }}>
  <View style={styles.chartSection}>
    <Text style={styles.chartTitle}>Energy Usage by Energy Type</Text>
    <View style={styles.chartContainer}>
      {/* Group addedItems by energy type */}
      {(() => {
        const energyTypeTotals = addedItems.reduce((acc, item) => {
          const energyType = item.type; // Assuming 'type' is part of the item object
          const emissions = calculateTotalCost(
            item.name.replace(/\s+/g, '').toLowerCase(),
            item.quantity
          ).totalCarbonEmissions;

          acc[energyType] = (acc[energyType] || 0) + emissions;
          return acc;
        }, {});

        // Convert grouped data into chart-friendly format
        const labels = Object.keys(energyTypeTotals);
        const data = Object.values(energyTypeTotals);

        return (
          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: data,
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green for emissions
                  strokeWidth: 3,
                },
              ],
            }}
            width={screenWidth * 0.9}
            height={300}
            chartConfig={{
              backgroundColor: '#1A1A40',
              backgroundGradientFrom: '#1E1E50',
              backgroundGradientTo: '#1A1A40',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            bezier
            style={styles.chart}
            verticalLabelRotation={0} // Horizontal labels
          />
        );
      })()}
    </View>
  </View>
</ViewShot>
   {/* Pie Chart for Cost Breakdown */}
<View style={styles.chartSection}>
  <ViewShot ref={costBreakdownRef} options={{ format: "jpg", quality: 0.9 }}>
    <Text style={styles.chartTitle}>Cost Breakdown</Text>
    <View style={[styles.chartContainer, { backgroundColor: '#FFFFFF', padding: 40 }]}>
      <PieChart
        data={pieChartData}
        width={screenWidth * 0.9} // Reduced width to make the pie chart smaller
        height={250} // Reduced height to make the pie chart smaller
        chartConfig={{
          backgroundColor: '#FFFFFF', // White background
          backgroundGradientFrom: '#FFFFFF', // Gradient starts as white
          backgroundGradientTo: '#FFFFFF', // Gradient ends as white
          decimalPlaces: 0, // No decimal places for values
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for chart elements
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for labels
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="10"
        absolute
        hasLegend={true}
      />
    </View>
  </ViewShot>
</View>
            {/* Total Costs Section */}
            <ViewShot ref={totalCostRef} options={{ format: "jpg", quality: 0.9 }}>
            <View style={styles.infoSection}>
              <Text style={styles.chartTitle}>Total Costs</Text>
              <View style={styles.costSummaryCard}>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Product Cost:</Text>
                  <Text style={styles.costValue}>₱{totalProductCost.toFixed(2)}</Text>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Installation Cost:</Text>
                  <Text style={styles.costValue}>₱{totalInstallationCost.toFixed(2)}</Text>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Maintenance Cost:</Text>
                  <Text style={styles.costValue}>₱{totalMaintenanceCost.toFixed(2)}</Text>
                </View>
                <View style={[styles.costRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Grand Total:</Text>
                  <Text style={styles.totalValue}>₱{totalCost.toFixed(2)}</Text>
                </View>
              </View>
            </View>
            </ViewShot>
{/* Export Button */}
<View style={styles.buttonContainer}>
  {/* Export to PDF Button */}
  <TouchableOpacity
        onPress={async () => {
          if (!addedItems || addedItems.length === 0) {
            console.error("No data available for PDF export!");
            return; // Exit early if no data is available
          }

          const userData = await fetchUserData();
          if (userData) {
            console.log("📄 User Data Retrieved:", userData);
            console.log("🛠️ Added Items Data:", addedItems);

            // Call ExportToPDF with user data
            exportToPDF(
              costBenefitRef,
              savingsRef,
              carbonRef,
              carbonRef1,
              energyUsageRef,
              totalCostRef,
              costBreakdownRef,
              addedItems,
              userData
            );
          } else {
            console.error("User data not available. Cannot export PDF.");
          }
        }}
        style={styles.exportButton}
      >
        <Text style={styles.buttonText}>Export to PDF</Text>
      </TouchableOpacity>

  {/* Save Data Button */}
  <TouchableOpacity onPress={saveData} style={styles.saveButton}>
    <Text style={styles.buttonText}>Save Data</Text>
  </TouchableOpacity>
</View>

{/* Close Button */}
<TouchableOpacity onPress={onClose} style={styles.button}>
  <Text style={styles.buttonText}>Close Analysis</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 0,
  },
  modalContainer: {
    width: '98%', // Made wider
    maxHeight: '95%',
    backgroundColor: '#1A1A40',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 0,
  },
  modalContainer: {
    width: '98%', // Made wider
    maxHeight: '95%',
    backgroundColor: '#1A1A40',
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#232350',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  section: {
    marginTop: 16,
    width: '100%',
  },
  chartSection: {
    marginTop: 24,
    width: '100%',
  },
  infoSection: {
    marginTop: 24,
    width: '100%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
    textAlign: 'left',
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 12,
    padding: 15,
    marginTop: 5,
  },
  chart: {
    borderRadius: 12,
  },
  analysisContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)',
    borderRadius: 10,
    width: '48%',
    backgroundColor: 'rgba(26, 26, 64, 0.7)',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  itemDetail: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 3,
  },
  noItemsText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  costSummaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 16,
    marginTop: 5,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 175, 80, 0.5)',
  },
  costLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  costValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 15,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  legendText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  exportButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },

  successModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  successModalContainer: {
    backgroundColor: '#28a745',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  successMessage: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: '#218838',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF4D4D', // Red background
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AddedItemsModal;