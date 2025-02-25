import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, Animated } from 'react-native';
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
                ? ['#1e1e1e', '#333']
                : ['#ffffff', '#f0f0f0'] // Gradient for light/dark mode
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
      {/* Home Tab */}
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? 'house.fill' : 'house'}
              size={28}
              color={focused ? Colors[colorScheme ?? 'light'].tint : color}
            />
          ),
        }}
      />

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
    </Tabs>
  );
}

// Animated Icon Component for Smooth Transitions
const AnimatedIcon = ({ name, size, color }: { name: string; size: number; color: string }) => {
  const scale = new Animated.Value(1);
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
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
});