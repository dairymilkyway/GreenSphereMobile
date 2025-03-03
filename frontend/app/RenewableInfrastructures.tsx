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
import { calculateTotalCost, PRICES } from './utils';
import AddedItemsModal from './AddedItemsModal'; // Import the modal

const RenewableSlots = ({ infrastructure, roofType, addItem }) => {
  const [selectedSlot, setSelectedSlot] = useState(null); // Stores the selected slot
  const [slotModalVisible, setSlotModalVisible] = useState(false); // Controls modal visibility
  const [isMarkedWithX, setIsMarkedWithX] = useState(false); // Tracks if the selected slot is marked with "X"

  const addSlot = (slot) => {
    addItem(slot); // Call the addItem function passed from the parent
    setSlotModalVisible(false);
  };
  
  const explanations = {
    "Single-Family with Gable": {
      "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
      <a href="https://www.nrel.gov/news/video/hydropower-energy-basics-text.html" target="_blank">Learn more</a>`,
  
      "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
    },
    "Single-Family with Flat": {
      "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
      <a href="https://www.nrel.gov/news/video/hydropower-energy-basics-text.html" target="_blank">Learn more</a>`,
  
      "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
    },
    "Single-Family with Shed": {
      "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
      <a href="https://www.nrel.gov/news/video/hydropower-energy-basics-text.html" target="_blank">Learn more</a>`,
  
      "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
    },
    "Single-Family with Butterfly": {
      "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
      <a href="https://www.nrel.gov/news/video/hydropower-energy-basics-text.html" target="_blank">Learn more</a>`,
  
      "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
    },
    "Cottages": {
      "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/">Learn more</a>`,
  
      "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
    },
    "TownHouse": {
      "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/">Learn more</a>`,
  
      "Vertical Farming": `These structures typically lack the space and structural capacity to support vertical farming systems. The energy demands for lighting and climate control are also high, making it impractical for residential use without significant modifications. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
    },
    "Mobile Home": {
      "Heat Pump": `Geothermal heat pumps are not compatible with mobile homes because they require underground loops for heat exchange, but mobile homes typically lack the necessary land space for installation. Additionally, mobile homes have limited insulation and ductwork, making geothermal systems less efficient. Lastly, the installation cost and structural requirements of geothermal heat pumps are impractical for most mobile home setups. 
      <a href="https://mobilehomeideas.com/a-comprehensive-guide-to-mobile-home-heat-pumps/">Learn more</a>`,
  
      "Solar Roof Tiles": `Mobile homes often have limited roof space and are frequently relocated, making the installation of solar roof tiles impractical. The structural integrity of mobile home roofs may also not support the weight of solar tiles. 
      <a href="https://www.intermtnwindandsolar.com/can-you-use-solar-power-for-a-mobile-home/">Learn more</a>`,
  
      "Vertical Farming": `Mobile homes have limited space and are not designed to support the weight or energy requirements of vertical farming systems. The mobility of these homes also conflicts with the permanent infrastructure needed for vertical farming. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/" target="_blank">Learn more</a>`,
    },
    "Apartments": {
      "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/">Learn more</a>`,
  
      "Solar Roof Tiles": `In multi-unit buildings, the roof space is often shared or limited, making it difficult to install solar roof tiles for individual units. Additionally, the orientation and shading of large buildings can reduce the efficiency of solar tiles. 
      <a href="https://build-construct.com/building/solar-roof-tiles/">Learn more</a>`,
    },
    "Office Building": {
      "Pico Hydropower": `These structures are typically located in urban or suburban areas where access to flowing water sources is rare. Pico hydropower requires proximity to a river or stream, which is uncommon in residential or commercial zones. Additionally, the infrastructure needed (e.g., penstocks, turbines) is not feasible for most single-family homes or multi-unit buildings. 
      <a href="https://www.waterpowermagazine.com/analysis/pico-practice-prospects-for-rural-hydro/">Learn more</a>`,
  
      "Solar Roof Tiles": `In multi-unit buildings, the roof space is often shared or limited, making it difficult to install solar roof tiles for individual units. Additionally, the orientation and shading of large buildings can reduce the efficiency of solar tiles. 
      <a href="https://build-construct.com/building/solar-roof-tiles/">Learn more</a>`,
    },
  };
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
   <>
     {/* Horizontal Scrollable Area */}
     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
       {/* Highly Recommended Label */}
       <View style={[styles.slot, styles.recommendationLabel, styles.highlyRecommended]}>
         <Text style={styles.labelText}>Highly Recommended</Text>
       </View>

       {/* Renewable Energy Slots */}
       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
         {renewableEnergySlots.map((slot, index) => {
           const isLastTwo = index >= renewableEnergySlots.length - 2;
           const isHeatPumpUnderMobileHome =
             slot.name === 'Heat Pump' && infrastructure === 'Mobile Home';

           return (
             <TouchableOpacity
               key={index}
               onPress={() => {
                 setSelectedSlot(slot); // Set the clicked slot data
                 setIsMarkedWithX(isLastTwo || isHeatPumpUnderMobileHome); // Track if the slot is marked with "X"
                 setSlotModalVisible(true); // Open the modal
               }}
               style={[
                 styles.slot,
                 (isLastTwo || isHeatPumpUnderMobileHome) ? styles.leastRecommendedSlot : null,
               ]}
             >
               {/* Slot Content */}
               <Image source={slot.image} style={styles.slotImage} />
               <Text style={styles.slotName}>{slot.name}</Text>

               {/* Apply "X" for last two slots OR if it's a Heat Pump under a Mobile Home */}
               {(isLastTwo || isHeatPumpUnderMobileHome) && (
                 <Text style={styles.xMark}>X</Text>
               )}
             </TouchableOpacity>
           );
         })}
       </ScrollView>

       {/* Least Recommended Label */}
       <View style={[styles.slot, styles.recommendationLabel, styles.leastRecommended]}>
         <Text style={styles.labelText}>Least Recommended</Text>
       </View>
     </ScrollView>

{/* Slot Modal */}
<Modal
  visible={slotModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setSlotModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* Header and Subheader */}
      <Text style={styles.modalHeader}>{selectedSlot?.name}</Text>
      <Text style={styles.modalSubheader}>Type: {selectedSlot?.type}</Text>

      {/* Image */}
      <Image
        source={selectedSlot?.image}
        style={{
          width: 100,
          height: 100,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginVertical: 10,
        }}
      />

      {/* Conditional Rendering for Compatibility Message */}
      {isMarkedWithX ? (
        <Text style={[styles.errorText, { color: 'red', fontSize: 20 }]}>
          ⚠️ Sorry, this Renewable Source cannot be applied to this infrastructure.
        </Text>
      ) : (
        <>
          <Text style={styles.infoText}>
            ✅ This renewable energy source is compatible with your chosen infrastructure.
          </Text>

          {/* Add Button */}
          <TouchableOpacity
            style={[styles.modalButton, { marginBottom: 10 }]}
            onPress={() => addSlot(selectedSlot)}
          >
            <Text style={styles.modalButtonText}>Add</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Close Button */}
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setSlotModalVisible(false)}
      >
        <Text style={styles.modalButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
   </>
 );
};



export default function RenewableInfrastructures() {
  const router = useRouter();
  const [addedItems, setAddedItems] = useState([]);

  // State to track if the Techno-Economic Analysis button is enabled
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // State for modal visibility to show added items
  const [addedItemsModalVisible, setAddedItemsModalVisible] = useState(false);


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
 const addItem = (item) => {
  const existingItemIndex = addedItems.findIndex(
    (addedItem) => addedItem.name === item.name && addedItem.type === item.type
  );

  if (existingItemIndex !== -1) {
    const updatedItems = [...addedItems];
    updatedItems[existingItemIndex].quantity += 1;
    setAddedItems(updatedItems);
  } else {
    const updatedItems = [...addedItems, { ...item, quantity: 1 }];
    setAddedItems(updatedItems);
  }

  setIsButtonEnabled(true); // Enable the button when an item is added
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
    roofType={selectedItem.roofType}
    addItem={addItem} // Pass the addItem function
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
     <TouchableOpacity
  style={[
    styles.card,
    !isButtonEnabled && styles.disabledCard, // Apply disabled style if the button is not enabled
  ]}
  onPress={() => {
    if (isButtonEnabled) {
      setAddedItemsModalVisible(true); // Open the modal
    }
  }}
>
  <Icon name="line-chart" size={24} color="#4CAF50" style={styles.cardIcon} />
  <Text style={styles.cardTitle}>Techno Economic Analysis</Text>
</TouchableOpacity>

     {/* Added Items Modal */}
     <AddedItemsModal
        visible={addedItemsModalVisible}
        onClose={() => setAddedItemsModalVisible(false)}
        addedItems={addedItems}
      />
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
  backgroundColor: '#4CAF50', // Green background
  padding: 12, // Padding inside the button
  borderRadius: 10, // Rounded corners
  width: '100%', // Full width of the modal
  alignItems: 'center', // Center-align text
  marginTop: 10, // Space above the button
},
modalButtonText: {
  fontSize: 18,
  color: '#FFFFFF', // White text
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
modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  justifyContent: 'center',
  alignItems: 'center',
},

modalContainer: {
  width: '85%',
  backgroundColor: '#FFFFFF', // White background for modal content
  borderRadius: 12, // Rounded corners
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 10, // For Android shadow
  alignItems: 'center', // Center align all content
},

// Header Text
modalHeader: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#fff', // Dark gray for contrast
  textAlign: 'center',
  marginBottom: 10,
},

// Subheader Text
modalSubheader: {
  fontSize: 20,
  color: '#fff', // Medium gray
  marginBottom: 8,
},

// Information Text
infoText: {
  fontSize: 20,
  color: '#008000', // Green color for positive feedback
  lineHeight: 20,   // Improved readability
  marginTop: 10,
  flexDirection: 'row', // Align text and emoji horizontally
  alignItems: 'center', // Vertically align text and emoji
},

// Error Text
errorText: {
  fontSize: 14,
  fontWeight: '500',
  textAlign: 'center',
  marginTop: 10,
},

// Link Text
linkText: {
  color: '#007BFF', // Standard blue for links
  textDecorationLine: 'underline',
  fontWeight: '600',
},
disabledCard: {
  opacity: 0.5, // Reduce opacity to indicate disabled state
},
});