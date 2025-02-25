import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Renewable() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Renewable Energy Solutions</Text>
      <Text style={styles.description}>
        Explore various renewable energy solutions and learn how they can help create a sustainable future.
      </Text>
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
  },
});