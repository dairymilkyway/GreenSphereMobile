import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';

const RenewableSlots = ({ infrastructure, roofType }) => {
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // Define the ranking of renewable energy sources for different infrastructures
  const renewableEnergyRankings = {
    "Single-Family with Gable": [
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Single-Family with Flat": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Single-Family with Shed": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Single-Family with Butterfly": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Cottages": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "TownHouse": [
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Mobile Home": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
    ],
    "Apartments": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
    ],
    "Office Building": [
      { type: 'Solar Energy', name: 'Solar Panels', image: '/assets/images/SolarPanel.png' },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: '/assets/images/HeatPump.png' },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: '/assets/images/SolarWaterHeating.png' },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: '/assets/images/VerticalAxisWindTurbine.png' },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: '/assets/images/SmallWindTurbine.png' },
      { type: 'Urban Farming', name: 'Vertical Farming', image: '/assets/images/VerticalFarming.png' },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: '/assets/images/MicroHydroPowerSystem.png' },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: '/assets/images/PicoHydroPower.png' },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: '/assets/images/SolarRoofTiles.png' },
    ],
  };

  const renewableEnergySlots =
    renewableEnergyRankings[`${infrastructure} with ${roofType}`] || renewableEnergyRankings[infrastructure] || [];

  return (
    <View style={styles.container}>
      {/* Highly Recommended and Least Recommended Labels */}
      <View style={styles.recommendationLabels}>
        <Text style={[styles.label, styles.highlyRecommended]}>Highly Recommended</Text>
        <Text style={[styles.label, styles.leastRecommended]}>Least Recommended</Text>
      </View>

      {/* Horizontal Scrollable Slots */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.slotsContainer}>
          {renewableEnergySlots.map((slot, index) => {
            const isLastTwo = index >= renewableEnergySlots.length - 2;
            const isHeatPumpUnderMobileHome = slot.name === 'Heat Pump' && infrastructure === 'Mobile Home';

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.slot,
                  hoveredSlot === index && styles.hoveredSlot,
                  isLastTwo && styles.leastRecommendedSlot,
                ]}
                onPress={() => setHoveredSlot(index)}
              >
                {/* Slot Content */}
                <Image source={{ uri: slot.image }} style={styles.slotImage} />
                <Text style={styles.slotName}>{slot.name}</Text>

                {/* Apply "X" for last two slots OR if it's a Heat Pump under a Mobile Home */}
                {(isLastTwo || isHeatPumpUnderMobileHome) && (
                  <Text style={styles.xMark}>X</Text>
                )}

                {/* Hover Tooltip */}
                {hoveredSlot === index && (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>{slot.type}</Text>
                    <Text style={styles.tooltipText}>{slot.name}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default function RenewableInfrastructures() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem?.main || selectedItem?.name}</Text>
            <Text style={styles.modalDescription}>
              {selectedItem?.description}
            </Text>

            {/* RenewableSlots Component */}
            {selectedItem && (
              <RenewableSlots
                infrastructure={selectedItem.main || selectedItem.name}
                roofType={selectedItem.roofType || ''}
              />
            )}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Example Button to Open Modal */}
      <TouchableOpacity onPress={() => openModal({ main: 'Single-Family', roofType: 'Gable' })}>
        <Text>Open Modal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1238',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1A1A40',
    borderRadius: 15,
    padding: 20,
    width: '90%', // Larger modal width
    maxHeight: '80%', // Larger modal height
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  recommendationLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
  },
  highlyRecommended: {
    backgroundColor: '#4CAF50', // Green for highly recommended
  },
  leastRecommended: {
    backgroundColor: '#FF5252', // Red for least recommended
  },
  slotsContainer: {
    flexDirection: 'row', // Horizontal layout
    alignItems: 'center',
  },
  slot: {
    width: 120,
    height: 120,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#1A1A40',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hoveredSlot: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  leastRecommendedSlot: {
    opacity: 0.5, // Dim the least recommended slots
  },
  slotImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  slotName: {
    fontSize: 12,
    color: '#E0E0E0',
    marginTop: 5,
    textAlign: 'center',
  },
  xMark: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tooltip: {
    position: 'absolute',
    bottom: -50,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  tooltipText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});