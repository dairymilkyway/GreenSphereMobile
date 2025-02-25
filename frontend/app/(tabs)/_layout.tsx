import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, Animated, Image, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: isDarkMode ? '#888' : '#ccc',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <LinearGradient
            colors={
              isDarkMode
                ? ['#1e1e1e', '#333'] // Dark mode gradient
                : ['#ffffff', '#f0f0f0'] // Light mode gradient
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tabBarBackground}
          />
        ),
        tabBarStyle: {
          ...Platform.select({
            ios: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 0,
              borderTopWidth: 0,
              backgroundColor: 'transparent',
            },
            android: {
              elevation: 8,
              borderTopWidth: 0,
              backgroundColor: 'transparent',
            },
          }),
          height: 70, // Increased height for better touch targets
        },
      }}>
      {/* Feedback Tab */}
      <Tabs.Screen
        name="Feedback"
        options={{
          title: 'Feedback',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? 'person.fill' : 'person'}
              size={28}
              color={focused ? Colors[colorScheme ?? 'light'].tint : color}
            />
          ),
        }}
      />

      {/* Home Tab (Center Tab) */}
      <Tabs.Screen
        name="Home"
        options={{
          title: '', // Remove the "Home" text
          tabBarIcon: ({ focused }) => (
            <HomeTabIcon focused={focused} />
          ),
        }}
      />

      {/* Renewable Tab */}
      <Tabs.Screen
        name="Renewable"
        options={{
          title: 'Renewable',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? 'leaf.fill' : 'leaf'}
              size={28}
              color={focused ? Colors[colorScheme ?? 'light'].tint : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

// Animated Icon Component for Smooth Transitions
const AnimatedIcon = ({ name, size, color }: { name: string; size: number; color: string }) => {
  const scale = new Animated.Value(1);
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.2,
      friction: 5, // Smoother spring effect
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5, // Smoother spring effect
      useNativeDriver: true,
    }).start();
  };
  return (
    <Animated.View
      style={{ transform: [{ scale }] }}
      onStartShouldSetResponder={() => true}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}>
      <IconSymbol name={name} size={size} color={color} />
    </Animated.View>
  );
};

// Custom Home Tab Icon with Enhanced Touch Responsiveness
const HomeTabIcon = ({ focused }: { focused: boolean }) => {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    // Scale up animation
    Animated.spring(scale, {
      toValue: 1.1, // Slightly larger scale
      friction: 5, // Smoother spring effect
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    // Scale back to normal
    Animated.spring(scale, {
      toValue: 1,
      friction: 5, // Smoother spring effect
      useNativeDriver: true,
    }).start();
  };

  const TouchableComponent = Platform.select({
    ios: TouchableOpacity,
    android: TouchableNativeFeedback,
  });

  return (
    <View style={styles.centerTabContainer}>
      <TouchableComponent
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Expand touchable area
        background={TouchableNativeFeedback.Ripple('#ccc', true)} // Ripple effect for Android
      >
        <Animated.View
          style={[
            styles.circleIconContainer,
            focused && styles.focusedCircle,
            { transform: [{ scale }] }, // Apply scaling animation
          ]}
        >
          <Image
            source={require('@/assets/images/greenspherelogo.png')}
            style={[
              styles.logo,
              { tintColor: focused ? '#fff' : '#333' }, // Dark logo when inactive, light when active
            ]}
          />
        </Animated.View>
      </TouchableComponent>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  tabBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  centerTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1, // Ensure it's above other tabs
  },
  circleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of width/height to make it a circle
    backgroundColor: '#fff', // Default background color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  focusedCircle: {
    backgroundColor: Colors.light.tint, // Change background color when focused
    borderColor: '#fff',
    borderWidth: 2, // Add a border for focus state
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});