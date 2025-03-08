import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { calculateTotalCost, PRICES } from './utils'; // Import both functions

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Custom Color Palette
const COLORS = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'];
const saveData = async () => {
  try {
    // Fetch logged-in user ID from the backend
    const userResponse = await fetch("http://192.168.0.251:8082/user", {
      method: "GET",
      credentials: "include", // Required to send cookies/session data
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch logged-in user.");
    }

    const userData = await userResponse.json();
    const user_id = userData.id; // Extract user ID

    console.log("✅ Logged-in User ID:", user_id);

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

    console.log("✅ Energy Usage Responses:", energyUsageResponses);

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Data saved successfully!",
      customClass: {
        container: 'swal2-container', // Add a custom class for the container
        popup: 'swal2-popup', // Add a custom class for the popup
      },
      didOpen: () => {
        // Manually set the z-index of the SweetAlert modal
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
          swalContainer.style.zIndex = '99999'; // Set a higher z-index than your main modal
        }
      }
    });

  } catch (error) {
    console.error("❌ Error saving data:", error);
    alert("Failed to save data.");
  }
};

const AddedItemsModal = ({ visible, onClose, addedItems }) => {
  // Prepare data for charts
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

  const totalCarbonEmissions = addedItems.reduce(
    (sum, item) => {
      const source = item.name.replace(/\s+/g, '').toLowerCase(); // Normalize the source key
      const prices = PRICES[source];
      return sum + (prices ? prices.carbonEmissions * item.quantity : 0);
    },
    0
  );

  const carbonPaybackPeriod = (totalCarbonEmissions / 1000).toFixed(2); // Example calculation

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

  const lineChartData = addedItems.map(item => ({
    name: item.name,
    emissions: calculateTotalCost(item.name.replace(/\s+/g, '').toLowerCase(), item.quantity).totalCarbonEmissions,
  }));

  const totalCost = totalProductCost + totalInstallationCost + totalMaintenanceCost;

  // Prepare carbon data for each item
  const carbonByItem = addedItems.map(item => {
    const source = item.name.replace(/\s+/g, '').toLowerCase();
    const prices = PRICES[source];
    const emissions = prices ? prices.carbonEmissions * item.quantity : 0;
    // Calculate individual payback period (simple example calculation)
    const payback = emissions / 100; // Example calculation
    
    return {
      name: item.name,
      emissions: emissions,
      payback: payback
    };
  });

  const carbonBarChartData = {
    labels: carbonByItem.map(item => item.name),
    datasets: [
      {
        data: carbonByItem.map(item => item.emissions),
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red for emissions
        strokeWidth: 2,
      },
      {
        data: carbonByItem.map(item => item.payback),
        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Blue for payback
        strokeWidth: 2,
      }
    ],
    legend: ['Emissions (kg CO₂)', 'Payback Period (years)']
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
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
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noItemsText}>No items added.</Text>
                )}
              </View>
            </View>

            {/* Bar Chart for Cost vs. Savings */}
            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>Cost vs. Savings Comparison</Text>
              <View style={styles.chartContainer}>
                <BarChart
                  data={barChartData}
                  width={screenWidth * 0.9}
                  height={250}
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
                      fontSize: 12,
                    },
                  }}
                  style={styles.chart}
                  verticalLabelRotation={45}
                  showValuesOnTopOfBars={true}
                />
              </View>
            </View>

               {/* Carbon Payback Period Analysis with Bar Chart */}
               <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>Carbon Payback Period Analysis</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>Total Carbon Emissions: {totalCarbonEmissions.toFixed(1)} kg CO₂</Text>
                <Text style={styles.infoText}>Overall Carbon Payback Period: {carbonPaybackPeriod} years</Text>
              </View>
              
              <View style={[styles.chartContainer, {marginTop: 15}]}>
                <BarChart
                  data={carbonBarChartData}
                  width={screenWidth * 0.9}
                  height={280}
                  yAxisLabel=""
                  chartConfig={{
                    backgroundColor: '#1A1A40',
                    backgroundGradientFrom: '#1E1E50',
                    backgroundGradientTo: '#1A1A40',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    barPercentage: 0.7,
                    propsForLabels: {
                      fontSize: 12,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                    },
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={styles.chart}
                  verticalLabelRotation={45}
                  showValuesOnTopOfBars={true}
                  withInnerLines={true}
                  fromZero={true}
                  segments={5}
                />
              </View>
              <View style={styles.legendContainer}>
                {carbonBarChartData.legend.map((label, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View 
                      style={[
                        styles.legendColor,
                        {backgroundColor: index === 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'}
                      ]} 
                    />
                    <Text style={styles.legendText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>


            {/* Pie Chart for Cost Breakdown */}
            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>Cost Breakdown</Text>
              <View style={styles.chartContainer}>
                <PieChart
                  data={pieChartData}
                  width={screenWidth * 0.9}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#1A1A40',
                    backgroundGradientFrom: '#1E1E50',
                    backgroundGradientTo: '#1A1A40',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: { borderRadius: 12 },
                  }}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  hasLegend={true}
                  center={[screenWidth * 0.2, 0]}
                  avoidFalseZero={true}
                />
              </View>
            </View>

            {/* Energy Usage Section */}
            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>Energy Usage by Source</Text>
              <View style={styles.chartContainer}>
                <LineChart
                  data={{
                    labels: lineChartData.map(item => item.name),
                    datasets: [
                      {
                        data: lineChartData.map(item => item.emissions),
                        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                        strokeWidth: 3,
                      },
                    ],
                  }}
                  width={screenWidth * 0.9}
                  height={250}
                  chartConfig={{
                    backgroundColor: '#1A1A40',
                    backgroundGradientFrom: '#1E1E50',
                    backgroundGradientTo: '#1A1A40',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: { borderRadius: 12 },
                    propsForLabels: {
                      fontSize: 12,
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </View>
            </View>

        
            {/* Total Costs Section */}
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
{/* Export Button */}
<View style={styles.buttonContainer}>
  {/* Export to PDF Button */}
  <TouchableOpacity
    onPress={async () => {
      if (!addedItems || addedItems.length === 0) {
        console.error("No data available for PDF export!");
        return; // Exit early if no data is available
      }

      // Fetch user data
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:3001/user', { withCredentials: true });
          return response.data.user; // Assuming the user data is returned in the `user` field
        } catch (error) {
          console.error("Error fetching user data:", error);
          return null;
        }
      };

      const userData = await fetchUserData();

      if (userData) {
        // Call ExportToPDF with user data
        exportToPDF(
          costBenefitRef,
          savingsRef,
          carbonRef,
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
});

export default AddedItemsModal;