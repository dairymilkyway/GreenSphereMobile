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
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome icons

const RenewableSlots = ({ infrastructure, roofType }) => {
  const [hoveredSlot, setHoveredSlot] = useState(null);


  const renewableEnergyRankings = {
    "Single-Family with Gable": [
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: require('../assets/images/SolarRoofTiles.png') },
      { type: 'Solar Energy', name: 'Solar Panels', image: require('../assets/images/SolarPanel.png') },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: require('../assets/images/SolarWaterHeating.png') },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: require('../assets/images/HeatPump.png') },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: require('../assets/images/SmallWindTurbine.png') },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: require('../assets/images/VerticalAxisWindTurbine.png') },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: require('../assets/images/MicroHydroPowerSystem.png') },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: require('../assets/images/PicoHydroPower.png') },
      { type: 'Urban Farming', name: 'Vertical Farming', image: require('../assets/images/VerticalFarming.png') },
    ],
    "Single-Family with Flat": [
      { type: 'Solar Energy', name: 'Solar Panels', image: require('../assets/images/SolarPanel.png') },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: require('../assets/images/SolarRoofTiles.png') },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: require('../assets/images/SolarWaterHeating.png') },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: require('../assets/images/HeatPump.png') },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: require('../assets/images/SmallWindTurbine.png') },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: require('../assets/images/VerticalAxisWindTurbine.png') },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: require('../assets/images/MicroHydroPowerSystem.png') },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: require('../assets/images/PicoHydroPower.png') },
      { type: 'Urban Farming', name: 'Vertical Farming', image: require('../assets/images/VerticalFarming.png') },
    ],
    "Single-Family with Shed": [
      { type: 'Solar Energy', name: 'Solar Panels', image: require('../assets/images/SolarPanel.png') },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: require('../assets/images/SolarRoofTiles.png') },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: require('../assets/images/SolarWaterHeating.png') },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: require('../assets/images/HeatPump.png') },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: require('../assets/images/SmallWindTurbine.png') },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: require('../assets/images/VerticalAxisWindTurbine.png') },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: require('../assets/images/MicroHydroPowerSystem.png') },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: require('../assets/images/PicoHydroPower.png') },
      { type: 'Urban Farming', name: 'Vertical Farming', image: require('../assets/images/VerticalFarming.png') },
    ],
    "Single-Family with Butterfly": [
      { type: 'Solar Energy', name: 'Solar Panels', image: require('../assets/images/SolarPanel.png') },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: require('../assets/images/SolarRoofTiles.png') },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: require('../assets/images/SolarWaterHeating.png') },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: require('../assets/images/HeatPump.png') },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: require('../assets/images/SmallWindTurbine.png') },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: require('../assets/images/VerticalAxisWindTurbine.png') },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: require('../assets/images/MicroHydroPowerSystem.png') },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: require('../assets/images/PicoHydroPower.png') },
      { type: 'Urban Farming', name: 'Vertical Farming', image: require('../assets/images/VerticalFarming.png') },
    ],
    "Cottages": [
      { type: 'Solar Energy', name: 'Solar Panels', image: require('../assets/images/SolarPanel.png') },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: require('../assets/images/SolarRoofTiles.png') },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: require('../assets/images/SolarWaterHeating.png') },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: require('../assets/images/HeatPump.png') },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: require('../assets/images/SmallWindTurbine.png') },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: require('../assets/images/VerticalAxisWindTurbine.png') },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: require('../assets/images/MicroHydroPowerSystem.png') },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: require('../assets/images/PicoHydroPower.png') },
      { type: 'Urban Farming', name: 'Vertical Farming', image: require('../assets/images/VerticalFarming.png') },
    ],
    "TownHouse": [
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: require('../assets/images/SolarRoofTiles.png') },
      { type: 'Solar Energy', name: 'Solar Panels', image: require('../assets/images/SolarPanel.png') },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: require('../assets/images/SolarWaterHeating.png') },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: require('../assets/images/HeatPump.png') },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: require('../assets/images/VerticalAxisWindTurbine.png') },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: require('../assets/images/SmallWindTurbine.png') },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: require('../assets/images/MicroHydroPowerSystem.png') },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: require('../assets/images/PicoHydroPower.png') },
      { type: 'Urban Farming', name: 'Vertical Farming', image: require('../assets/images/VerticalFarming.png') },
    ],
    "Mobile Home": [
      { type: 'Solar Energy', name: 'Solar Panels', image: require('../assets/images/SolarPanel.png') },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: require('../assets/images/SolarWaterHeating.png') },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: require('../assets/images/VerticalAxisWindTurbine.png') },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: require('../assets/images/SmallWindTurbine.png') },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: require('../assets/images/MicroHydroPowerSystem.png') },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: require('../assets/images/PicoHydroPower.png') },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: require('../assets/images/HeatPump.png') },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: require('../assets/images/SolarRoofTiles.png') },
      { type: 'Urban Farming', name: 'Vertical Farming', image: require('../assets/images/VerticalFarming.png') },
    ],
    "Apartments": [
      { type: 'Solar Energy', name: 'Solar Panels', image: require('../assets/images/SolarPanel.png') },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: require('../assets/images/HeatPump.png') },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: require('../assets/images/SolarWaterHeating.png') },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: require('../assets/images/VerticalAxisWindTurbine.png') },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: require('../assets/images/SmallWindTurbine.png') },
      { type: 'Urban Farming', name: 'Vertical Farming', image: require('../assets/images/VerticalFarming.png') },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: require('../assets/images/MicroHydroPowerSystem.png') },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: require('../assets/images/PicoHydroPower.png') },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: require('../assets/images/SolarRoofTiles.png') },
    ],
    "Office Building": [
      { type: 'Solar Energy', name: 'Solar Panels', image: require('../assets/images/SolarPanel.png') },
      { type: 'Geothermal Energy', name: 'Heat Pump', image: require('../assets/images/HeatPump.png') },
      { type: 'Solar Energy', name: 'Solar Water Heating', image: require('../assets/images/SolarWaterHeating.png') },
      { type: 'Wind Energy', name: 'Vertical Axis Wind Turbines', image: require('../assets/images/VerticalAxisWindTurbine.png') },
      { type: 'Wind Energy', name: 'Small Wind Turbines', image: require('../assets/images/SmallWindTurbine.png') },
      { type: 'Urban Farming', name: 'Vertical Farming', image: require('../assets/images/VerticalFarming.png') },
      { type: 'HydroPower Energy', name: 'Micro Hydropower System', image: require('../assets/images/MicroHydroPowerSystem.png') },
      { type: 'HydroPower Energy', name: 'Pico Hydropower', image: require('../assets/images/PicoHydroPower.png') },
      { type: 'Solar Energy', name: 'Solar Roof Tiles', image: require('../assets/images/SolarRoofTiles.png') },
    ],
  };
   // Get the renewable energy slots based on the selected infrastructure and roof type
   const renewableEnergySlots =
   renewableEnergyRankings[`${infrastructure} with ${roofType}`] ||
   renewableEnergyRankings[infrastructure] ||
   [];

 return (
   <View style={styles.renewableContainer}>
     {/* Horizontal Scrollable Area */}
     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
       {/* Highly Recommended Label */}
       <View style={[styles.slot, styles.recommendationLabel, styles.highlyRecommended]}>
         <Text style={styles.labelText}>Highly Recommended</Text>
       </View>

       {/* Renewable Energy Slots */}
       {renewableEnergySlots.map((slot, index) => {
         const isLastTwo = index >= renewableEnergySlots.length - 2;
         const isHeatPumpUnderMobileHome =
           slot.name === 'Heat Pump' && infrastructure === 'Mobile Home';

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
             <Image source={slot.image} style={styles.slotImage} />
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

       {/* Least Recommended Label */}
       <View style={[styles.slot, styles.recommendationLabel, styles.leastRecommended]}>
         <Text style={styles.labelText}>Least Recommended</Text>
       </View>
     </ScrollView>
   </View>
 );
};

export default function RenewableInfrastructures() {
 const router = useRouter();

 // Data structure for infrastructures
 const infrastructures = [
   {
     main: 'Single-Family',
     icon: 'home', // FontAwesome icon name
     submains: [
       {
         name: 'Single-Family with Gable',
         icon: 'home',
         description:
           'A gable roof is a classic triangular roof design, commonly used in single-family homes.',
       },
       {
         name: 'Single-Family with Flat',
         icon: 'home',
         description:
           'A flat roof is a horizontal or slightly sloped roof design, often used in modern architecture.',
       },
       {
         name: 'Single-Family with Shed',
         icon: 'home',
         description:
           'A shed roof has a single slope, making it ideal for small structures and minimalist designs.',
       },
       {
         name: 'Single-Family with Butterfly',
         icon: 'home',
         description:
           'A butterfly roof features two slopes that angle downward toward the center, creating a unique design.',
       },
     ],
   },
   {
     main: 'Cottages',
     icon: 'home',
     description:
       'Cottages are small, cozy homes often located in rural or vacation areas.',
   },
   {
     main: 'TownHouse',
     icon: 'home',
     description:
       'Townhouses are multi-floor homes sharing walls with adjacent properties, common in urban areas.',
   },
   {
     main: 'Mobile Home',
     icon: 'home',
     description:
       'Mobile homes are prefabricated homes designed to be transportable and affordable.',
   },
   {
     main: 'Apartments',
     icon: 'home',
     description:
       'Apartments are individual units within a larger building, offering shared amenities.',
   },
   {
     main: 'Office Building',
     icon: 'home',
     description:
       'Office buildings are commercial spaces designed for businesses and workspaces.',
   },
 ];

 // State to track expanded cards
 const [expandedCard, setExpandedCard] = useState(null);

 // State to track modal visibility and selected item
 const [modalVisible, setModalVisible] = useState(false);
 const [selectedItem, setSelectedItem] = useState(null);

 // Toggle expansion for a specific card
 const toggleExpansion = (index) => {
   setExpandedCard(expandedCard === index ? null : index);
 };

 // Open modal with item details
 const openModal = (item) => {
   setSelectedItem(item);
   setModalVisible(true);
 };

 return (
   <ScrollView contentContainerStyle={styles.container}>
     {/* Modal */}
     <Modal
       animationType="slide"
       transparent={true}
       visible={modalVisible}
       onRequestClose={() => setModalVisible(false)}
     >
       <View style={styles.modalOverlay}>
         <View style={styles.modalContent}>
           {/* Title and Icon */}
           <Text style={styles.modalTitle}>{selectedItem?.main || selectedItem?.name}</Text>
           <Icon
             name={selectedItem?.icon}
             size={50}
             color="#4CAF50"
             style={styles.modalIcon}
           />
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

           {/* Close Button */}
           <TouchableOpacity
             style={styles.modalButton}
             onPress={() => setModalVisible(false)}
           >
             <Text style={styles.modalButtonText}>Close</Text>
           </TouchableOpacity>
         </View>
       </View>
     </Modal>

     {/* Header Section */}
     <Text style={styles.title}>Renewable Infrastructures</Text>
     <Text style={styles.description}>
       Learn about infrastructures supporting renewable energy.
     </Text>

     {/* Cards Section */}
     {infrastructures.map((item, index) => (
       <View key={index}>
         {/* Main Card */}
         <TouchableOpacity
           style={[styles.card, styles.shadow]}
           onPress={() =>
             item.submains && item.submains.length > 0
               ? toggleExpansion(index)
               : openModal(item) // Open modal for categories without subcategories
           }
           activeOpacity={0.8}
         >
           <Icon name={item.icon} size={30} color="#4CAF50" style={styles.cardIcon} />
           <Text style={styles.cardTitle}>{item.main}</Text>
         </TouchableOpacity>

         {/* Subcategories */}
         {expandedCard === index && item.submains && item.submains.length > 0 && (
           <View style={styles.submainContainer}>
             {item.submains.map((submain, idx) => (
               <TouchableOpacity
                 key={idx}
                 style={[styles.submainButton, styles.shadow]}
                 onPress={() => openModal(submain)} // Open modal for subcategories
                 activeOpacity={0.8}
               >
                 <Icon name={submain.icon} size={20} color="#4CAF50" style={styles.submainIcon} />
                 <Text style={styles.submainButtonText}>{submain.name}</Text>
               </TouchableOpacity>
             ))}
           </View>
         )}
       </View>
     ))}

     {/* Go Back Button */}
     <TouchableOpacity style={styles.button} onPress={() => router.back()}>
       <Text style={styles.buttonText}>Go Back</Text>
     </TouchableOpacity>
   </ScrollView>
 );
}

const styles = StyleSheet.create({
 container: {
   flexGrow: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#0F1238',
   padding: 20,
 },
 title: {
   fontSize: 28,
   fontWeight: 'bold',
   color: '#4CAF50',
   marginBottom: 20,
   textAlign: 'center',
 },
 description: {
   fontSize: 16,
   color: '#FFFFFF',
   textAlign: 'center',
   marginBottom: 30,
 },
 card: {
   flexDirection: 'row',
   alignItems: 'center',
   backgroundColor: '#1A1A40',
   borderRadius: 15,
   padding: 15,
   width: '100%',
   marginBottom: 15,
   borderWidth: 1,
   borderColor: 'rgba(76, 175, 80, 0.5)',
 },
 cardIcon: {
   marginRight: 15,
 },
 cardTitle: {
   fontSize: 20,
   fontWeight: 'bold',
   color: '#4CAF50',
   flex: 1,
 },
 shadow: {
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 4 },
   shadowOpacity: 0.3,
   shadowRadius: 6,
   elevation: 5,
 },
 submainContainer: {
   marginLeft: 20,
   marginBottom: 20,
 },
 submainButton: {
   flexDirection: 'row',
   alignItems: 'center',
   backgroundColor: '#4CAF50',
   borderRadius: 10,
   paddingVertical: 12,
   paddingHorizontal: 15,
   marginBottom: 10,
 },
 submainIcon: {
   marginRight: 10,
 },
 submainButtonText: {
   fontSize: 16,
   color: '#FFFFFF',
   textAlign: 'center',
   fontWeight: 'bold',
 },
 button: {
   backgroundColor: '#4CAF50',
   padding: 15,
   borderRadius: 10,
   width: '100%',
   alignItems: 'center',
   marginTop: 20,
 },
 buttonText: {
   fontSize: 18,
   color: '#FFFFFF',
   fontWeight: 'bold',
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
   width: '90%', // Increased modal width
   maxHeight: '80%', // Increased modal height
   alignItems: 'center',
 },
 modalTitle: {
   fontSize: 24,
   fontWeight: 'bold',
   color: '#4CAF50',
   marginBottom: 15,
   textAlign: 'center',
 },
 modalIcon: {
   marginBottom: 15,
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
 renewableContainer: {
  width: '100%',
  marginTop: 20,
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
recommendationLabel: {
  backgroundColor: 'transparent', // Transparent background for labels
  borderWidth: 2,
  borderColor: '#FFFFFF',
},
highlyRecommended: {
  borderColor: '#4CAF50', // Green border for highly recommended
},
leastRecommended: {
  borderColor: '#FF5252', // Red border for least recommended
},
labelText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#FFFFFF',
  textAlign: 'center',
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