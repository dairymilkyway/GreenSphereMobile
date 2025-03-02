import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onReload?: () => void;
  showBackButton?: boolean;
  backgroundColor?: string;
}

export default function Header({ 
  title, 
  onReload, 
  showBackButton = true,
  backgroundColor = '#0F1238'
}: HeaderProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleReload = () => {
    if (onReload) {
      onReload();
    }
  };

  return (
    <View style={[styles.header, { backgroundColor }]}>
      {/* Left: Back Button */}
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleGoBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Center: Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right: Reload Button */}
      <View style={styles.rightContainer}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleReload}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    width: '100%',
    paddingHorizontal: 17,
    paddingTop: StatusBar.currentHeight + 11, // Move down to avoid notch and add extra padding
    marginTop: 20, // Add margin to move the entire header down
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  iconButton: {
    padding: 8,
  },
}); 