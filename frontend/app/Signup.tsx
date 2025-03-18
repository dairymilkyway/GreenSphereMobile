import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import config from './config'; // Import the configuration file

const { width } = Dimensions.get('window');

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male'); // Default to male
  const [password, setPassword] = useState('');

  // Gender options
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  const handleSignup = async () => {
    try {
      // Validate input fields
      const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isValidPassword = (password) => password.length >= 8;

      if (!isValidEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address.');
        return;
      }

      if (!isValidPassword(password)) {
        Alert.alert('Error', 'Password must be at least 8 characters long.');
        return;
      }

      for (const ip of config.ipList) {
        const apiUrl = `http://192.168.0.251:8082/signup`;
        try {
          console.log(`Attempting signup with IP: ${ip}`);
          console.log('Sending payload:', { name, email, gender, password });

          const result = await axios.post(
            apiUrl,
            { name, email, gender, password },
            {
              withCredentials: true,
              timeout: 5000,
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (result.status === 201) {
            console.log('User created successfully');
            router.push('/Login');
            return;
          }
        } catch (error) {
          console.warn(`IP ${ip} failed:`, error.response ? error.response.data : error.message);
        }
      }

      Alert.alert('Error', 'Unable to connect to any backend server. Please try again later.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LinearGradient colors={['#05002E', '#191540']} style={styles.container}>
      <View style={styles.leftSection}>
        <Image source={require('@/assets/images/greenspherelogo.png')} style={styles.logo} />
        <View style={styles.formContainer}>
          <ThemedText type="title" style={styles.title}>
            Create an account
          </ThemedText>
          <ThemedText style={styles.subtitle}>Let’s get started!</ThemedText>

          {/* Name */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#CCCCCC"
            value={name}
            onChangeText={setName}
          />

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#CCCCCC"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Gender Dropdown */}
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            containerStyle={styles.dropdownContainer}
            data={genderOptions}
            maxHeight={120}
            labelField="label"
            valueField="value"
            placeholder="Select Gender"
            value={gender}
            onChange={(item) => setGender(item.value)}
          />

          {/* Password */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#CCCCCC"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Signup Button */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <ThemedText style={styles.buttonText}>Sign up</ThemedText>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/Login')}>
              <ThemedText style={styles.loginLink}>Log in</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftSection: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0F1238',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#CCCCCC',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3333FF',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    color: '#FFFFFF',
  },
  // Dropdown styles
  dropdown: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#3333FF',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: 'transparent', // Transparent background
  },
  dropdownContainer: {
    backgroundColor: '#0F1238', // Dropdown list background
    borderColor: '#3333FF',
    borderRadius: 8,
  },
  placeholderStyle: {
    color: '#CCCCCC', // Placeholder color
    fontSize: 14,
  },
  selectedTextStyle: {
    color: '#FFFFFF', // White text for selected item
    fontSize: 14,
    backgroundColor: 'transparent', // Transparent selected box
  },
  itemTextStyle: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3333FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    color: '#CCCCCC',
  },
  loginLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
