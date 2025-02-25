import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Renewable() {
  const router = useRouter();
  const [showCards, setShowCards] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Renewable Energy Solutions</Text>
      <Text style={styles.description}>
        Explore various renewable energy solutions and learn how they can help create a sustainable future.
      </Text>
      {showCards && (
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/RenewableModels')}>
            <Text style={styles.cardTitle}>Renewable Energy Models</Text>
            <Text style={styles.cardDescription}>Discover different models of renewable energy systems.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/RenewableInfrastructures')}>
            <Text style={styles.cardTitle}>Renewable Infrastructures</Text>
            <Text style={styles.cardDescription}>Learn about infrastructures supporting renewable energy.</Text>
          </TouchableOpacity>
        </View>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  card: {
    backgroundColor: '#1A1A40',
    padding: 20,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});