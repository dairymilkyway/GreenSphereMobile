import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface TechnoEconomicAnalysisProps {
  route: {
    params?: {
      addedItems: string[]; // List of added items passed via navigation
    };
  };
}

const TechnoEconomicAnalysis: React.FC<TechnoEconomicAnalysisProps> = ({ route }) => {
  // Safely access route.params and provide a fallback value
  const addedItems = route?.params?.addedItems || [];

  // Ensure addedItems is always an array
  if (!Array.isArray(addedItems)) {
    console.error('Invalid addedItems:', addedItems);
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Techno-Economic Analysis</Text>

      {/* Display Added Items */}
      {addedItems.length > 0 ? (
        <FlatList
          data={addedItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noItemsText}>No items have been added yet.</Text>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1238',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
    width: '100%',
  },
  itemContainer: {
    backgroundColor: '#1A1A40',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  itemText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  noItemsText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default TechnoEconomicAnalysis;