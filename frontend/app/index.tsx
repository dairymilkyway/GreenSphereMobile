import React, { useEffect, useRef } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const LandingPage = () => {
  // Developer Data
  const developers = [
    { name: "Gayapa, Jhon Ludwig C.", image: require("@/assets/images/ludwig.jpg") },
    { name: "Barte, Gwyn S.", image: require("@/assets/images/gwyn.jpg") },
    { name: "Obreros, Jhun Mark G.", image: require("@/assets/images/jm.jpg") },
    { name: "Prado, Kristine Mae P.", image: require("@/assets/images/km.jpg") },
  ];

  const features = [
    { 
      icon: <MaterialIcons name="local-florist" size={24} color="white" />, 
      title: "Eco-Friendly", 
      desc: "We prioritize sustainability with green energy solutions tailored to meet the needs of modern living." 
    },
    { 
      icon: <MaterialIcons name="lightbulb" size={24} color="white" />, 
      title: "User-Friendly", 
      desc: "Our intuitive and easy-to-use platform makes it simple for anyone to design and apply renewable energy projects." 
    },
    {
      icon: (
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="check-bold" size={24} color="white" />
        </View>
      ),
      title: "Reliable",
      desc: "We provide well-tested, scientifically backed solutions that ensure efficiency and long-term performance."
    },
  ];

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Spinning Animation for Logo
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in and scale-up animation for the hero section
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous spinning animation for the logo (coin flip effect)
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000, // Duration of one full spin (3 seconds)
        easing: Easing.linear, // Linear easing for smooth rotation
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim, scaleAnim, spinAnim]);

  // Interpolate spinAnim for 3D coin flip effect
  const spin = spinAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "180deg", "360deg"], // Full 360-degree flip
  });

  const scale = spinAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.7, 1], // Scale down during the flip for perspective
  });

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <LinearGradient colors={["#0e0a36", "#1c1a2e"]} style={styles.heroSection}>
        {/* Static Logo Section */}
        <Animated.View 
          style={[
            styles.hero3D,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.Image 
            source={require('@/assets/images/greenspherelogo.png')}
            style={[
              styles.logo,
              {
                transform: [
                  { rotateY: spin }, // Apply 3D rotation
                  { perspective: 1000 }, // Add perspective for depth
                  { scale }, // Apply scaling for perspective effect
                ],
              },
            ]}
          />
        </Animated.View>
        {/* Hero Content Section */}
        <Animated.View 
          style={[
            styles.heroContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
            },
          ]}
        >
          <Text style={styles.heroTitle}>Design Your Sustainable Future with GreenSphere</Text>
          <Text style={styles.heroSubtitle}>A powerful simulator for designing and applying renewable energy solutions. Start building your greener future today!</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/Signup')}
          >
            <Text style={styles.buttonText}>Get Started for Free</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose Greensphere?</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
                },
              ]}
            >
              <View style={styles.featureIcon}>{feature.icon}</View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Developers Section */}
      <View style={styles.developersSection}>
        <Text style={styles.sectionTitle}>Developers of the System</Text>
        <View style={styles.developersGrid}>
          {developers.map((dev, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.developerCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
                },
              ]}
            >
              <Image source={dev.image} style={styles.developerImage} />
              <Text style={styles.developerName}>{dev.name}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 GreenSphere. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0a36",
  },
  heroSection: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  heroTitle: {
    fontSize: width > 600 ? 24 : 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: width > 600 ? 16 : 14,
    color: "white",
    opacity: 0.8,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  hero3D: {
    width: width > 600 ? width * 0.4 : width * 0.8,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    backfaceVisibility: "hidden", // Ensures the back of the image is not visible during the flip
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: "column",
    alignItems: "center",
  },
  featureCard: {
    width: width > 600 ? width * 0.3 : width * 0.8,
    alignItems: "center",
    marginBottom: 20,
  },
  featureIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
  featureDesc: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
    textAlign: "center",
  },
  developersSection: {
    padding: 20,
  },
  developersGrid: {
    flexDirection: "column",
    alignItems: "center",
  },
  developerCard: {
    width: width > 600 ? width * 0.45 : width * 0.8,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  developerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  developerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#0e0a36",
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    color: "white",
    fontSize: 12,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LandingPage;