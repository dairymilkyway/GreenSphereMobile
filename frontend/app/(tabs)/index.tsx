// filepath: frontend/app/(tabs)/index.tsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { OrbitControls, useGLTF, Sphere, Points, PointMaterial } from "@react-three/drei/native";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from 'expo-router';
import { LinearGradient } from "expo-linear-gradient";
import { Rating } from "react-native-ratings";

const { width, height } = Dimensions.get("window");

// Rotating Logo Component
const RotatingLogo = ({ scene, position, scale }) => {
  const logoRef = useRef();
  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.x = Math.PI / 2;
    }
  });

  return <primitive ref={logoRef} object={scene} position={position} scale={scale} />;
};

// Static Model Component
const StaticModel = ({ scene, position, scale }) => {
  return <primitive object={scene} position={position} scale={scale} />;
};

// Circular Platform for Logo
const Platform = () => {
  return (
    <mesh position={[0, -2.5, 0]}>
      <cylinderGeometry args={[3, 3, 0.2, 32]} />
      <meshStandardMaterial color="#649860" />
    </mesh>
  );
};

const LandingPage = () => {
  const navigation = useNavigation();
  const { scene: logoScene } = useGLTF(require('../../assets/models/greenspherelogo.glb'));
  const { scene: textScene } = useGLTF(require('../../assets/models/greenspheretext.glb'));

  // Developer Data
  const developers = [
    { name: "Gayapa, Jhon Ludwig C.", image: require("@/assets/images/ludwig.jpg") },
    { name: "Barte, Gwyn S.", image: require("@/assets/images/gwyn.jpg") },
    { name: "Obreros, Jhun Mark G.", image: require("@/assets/images/jm.jpg") },
    { name: "Prado, Kristine Mae P.", image: require("@/assets/images/km.jpg") },
  ];

  const features = [
    { icon: <MaterialIcons name="local-florist" size={24} color="white" />, title: "Eco-Friendly", desc: "We prioritize sustainability with green energy solutions tailored to meet the needs of modern living." },
    { icon: <MaterialIcons name="lightbulb" size={24} color="white" />, title: "User-Friendly", desc: "Our intuitive and easy-to-use platform makes it simple for anyone to design and apply renewable energy projects." },
    { icon: <MaterialCommunityIcons name="verified" size={24} color="white" />, title: "Reliable", desc: "We provide well-tested, scientifically backed solutions that ensure efficiency and long-term performance." },
  ];

  const Stars = () => {
    const starPositions = useMemo(() => {
      const positions = [];
      for (let i = 0; i < 500; i++) {
        positions.push((Math.random() - 0.5) * 20, Math.random() * 10, (Math.random() - 0.5) * 20);
      }
      return new Float32Array(positions);
    }, []);

    return (
      <Points positions={starPositions}>
        <PointMaterial size={0.05} color="white" />
      </Points>
    );
  };

  const Sun = () => (
    <Sphere args={[0.7, 32, 32]} position={[4, 3, -5]}>
      <meshStandardMaterial emissive="yellow" emissiveIntensity={2} color="yellow" />
    </Sphere>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <LinearGradient colors={["#0e0a36", "#1c1a2e"]} style={styles.heroSection}>
        {/* 3D Logo Section */}
        <View style={styles.hero3D}>
          <Canvas style={styles.canvas} camera={{ position: [0, 0, 15] }}>
            <OrbitControls enableZoom={true} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[2, 2, 2]} intensity={1} />
            <Platform />
            <RotatingLogo scene={logoScene} position={[0, 1.7, 0.2]} scale={[1, 1, 1]} />
            <StaticModel scene={textScene} position={[0, -1.1, 0]} scale={[0.1, 0.1, 0.1]} />
            <Sun />
            <Stars />
          </Canvas>
        </View>

        {/* Hero Content Section */}
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Design Your Sustainable Future with GreenSphere</Text>
          <Text style={styles.heroSubtitle}>A powerful simulator for designing and applying renewable energy solutions. Start building your greener future today!</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/Signup')}>
            <Text style={styles.buttonText}>Get Started for Free</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose Greensphere?</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>{feature.icon}</View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Developers Section */}
      <View style={styles.developersSection}>
        <Text style={styles.sectionTitle}>Developers of the System</Text>
        <View style={styles.developersGrid}>
          {developers.map((dev, index) => (
            <View key={index} style={styles.developerCard}>
              <Image source={dev.image} style={styles.developerImage} />
              <Text style={styles.developerName}>{dev.name}</Text>
            </View>
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
  },
  canvas: {
    flex: 1,
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
});

export default LandingPage;