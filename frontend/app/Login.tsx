import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const handleLogin = async () => {
    setIsLoading(true); // Show loading indicator
    try {
      // Validate email format
      const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address.');
        setIsLoading(false);
        return;
      }

      // Log the payload being sent to the server
      console.log('Attempting login with payload:', { email, password });

      const apiUrl = `http://192.168.0.251:8082/login`; // Use the specific IP and port
      console.log(`Attempting login with IP: 172.20.10.3:8082`);

      try {
        const loginResponse = await axios.post(
          apiUrl,
          { email, password },
          {
            timeout: 5000, // Increased timeout to 5 seconds
            headers: { 'Content-Type': 'application/json' }, // Add headers if required
          }
        );

        // Log the full response from the server
        console.log('Login response:', loginResponse.data);

        // Handle successful login
        if (loginResponse.data.message === 'Success') {
          await AsyncStorage.setItem('token', loginResponse.data.token);
          console.log('Token stored successfully:', loginResponse.data.token);

          // Redirect based on user role
          const redirectTo = loginResponse.data.role === 'admin' ? '/adminhome' : '/Home';
          console.log(`Redirecting to: ${redirectTo}`);
          router.replace(redirectTo);
        } 
        // Handle OTP verification redirect
        else if (loginResponse.data.redirect === '/verify-otp') {
          console.log('Redirecting to OTP verification for email:', email);
          router.push(`/OtpVerification?email=${encodeURIComponent(email)}`);
        } 
        // Handle unexpected response
        else {
          console.warn('Unexpected response from server:', loginResponse.data);
          Alert.alert('Error', 'Unexpected response from the server. Please try again later.');
        }
      } catch (error) {
        // Log detailed error information
        console.warn('Login failed:', error.response ? error.response.data : error.message || error);
        Alert.alert('Error', 'Unable to connect to the backend server. Please try again later.');
      }
    } catch (error) {
      // Catch any other unexpected errors
      console.error('Login error:', error.message || error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <LinearGradient colors={['#05002E', '#191540']} style={styles.container}>
      <View style={styles.leftSection}>
        <Image 
          source={require('@/assets/images/greenspherelogo.png')}
          style={styles.logo}
        />
        <View style={styles.formContainer}>
          <ThemedText type="title" style={styles.title}>Welcome Back!</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to your Account!</ThemedText>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#CCCCCC"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#CCCCCC"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" /> // Show loading indicator
            ) : (
              <ThemedText style={styles.buttonText}>Log in</ThemedText>
            )}
          </TouchableOpacity>
          
          <View style={styles.signupContainer}>
            <ThemedText style={styles.signupText}>Don't have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/Signup')}>
              <ThemedText style={styles.signupLink}>Sign up</ThemedText>
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
  loginButton: {
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
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: '#CCCCCC',
  },
  signupLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});