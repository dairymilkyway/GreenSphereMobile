import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome icons

export default function Renewable() {
  const router = useRouter();
  const [showCards, setShowCards] = useState(true);

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <View style={styles.gradientBackground}>
        <View style={[styles.gradientLayer, { backgroundColor: '#0F1238' }]} />
        <View style={[styles.gradientLayer, { backgroundColor: '#05061A', opacity: 0.8 }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Renewable Energy Solutions</Text>
          <Text style={styles.description}>
            Explore various renewable energy solutions and learn how they can help create a sustainable future.
          </Text>
        </View>

        {/* Card Section */}
        {showCards && (
          <View style={styles.cardContainer}>
            {/* Card 1: Renewable Energy Models */}
            <TouchableOpacity
              style={[styles.card, styles.shadow]}
              onPress={() => router.push('/RenewableModel')}
              activeOpacity={0.8}
            >
              <Icon name="bolt" size={60} color="#4CAF50" />
              <Text style={styles.cardTitle}>Renewable Energy Models</Text>
              <Text style={styles.cardDescription}>
                Discover different models of renewable energy systems.
              </Text>
            </TouchableOpacity>

            {/* Card 2: Renewable Infrastructures */}
            <TouchableOpacity
              style={[styles.card, styles.shadow]}
              onPress={() => router.push('/RenewableInfrastructures')}
              activeOpacity={0.8}
            >
              <Icon name="building" size={60} color="#4CAF50" />
              <Text style={styles.cardTitle}>Renewable Infrastructures</Text>
              <Text style={styles.cardDescription}>
                Learn about infrastructures supporting renewable energy.
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#E0E0E0',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    backgroundColor: '#1A1A40',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 240,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});