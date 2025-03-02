import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, StatusBar } from 'react-native';
import Header from '../header'; // Import the Header component

export default function Home() {
  // Animation values
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current; // Start slightly smaller
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the logo: Fade in and scale up
    Animated.parallel([
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        friction: 5, // Bouncy effect
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After logo animation, animate the text
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 200, // Staggered appearance
        useNativeDriver: true,
      }).start();
    });
  }, [logoFadeAnim, logoScaleAnim, textFadeAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Animated.Image
          source={require('@/assets/images/greenspherelogo.png')}
          resizeMode="contain" // Ensures the entire logo is visible
          style={[
            styles.logo,
            {
              opacity: logoFadeAnim,
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
        />

        {/* Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: textFadeAnim,
            },
          ]}
        >
          Welcome to GreenSphere
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1238', // Dark background for contrast
    paddingTop: StatusBar.currentHeight, // Move down to avoid notch
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150, // Adjust based on your logo's actual size
    height: 150, // Ensure this matches the aspect ratio of your logo
    marginBottom: 30,
    shadowColor: '#fff', // Add glow effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50', // Green text for branding
    textAlign: 'center',
    letterSpacing: 1.5, // Add spacing between letters
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Subtle shadow for depth
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});