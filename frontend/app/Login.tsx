import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import config from './config'; // Import the configuration file

const { width } = Dimensions.get('window');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const handleLogin = async () => {
    setIsLoading(true); // Show loading indicator
    try {
      for (const ip of config.ipList) {
        const apiUrl = `http://${ip}/login`;
        try {
          console.log(`Attempting login with IP: ${ip}`);
          const loginResponse = await axios.post(apiUrl, { email, password }, { timeout: 500 }); // Timeout after 0.5 seconds

          if (loginResponse.data.message === 'Success') {
            // Store the token
            await AsyncStorage.setItem('token', loginResponse.data.token);
            router.replace(loginResponse.data.role === 'admin' ? '/adminhome' : '/Home');
            return; // Exit the loop if login succeeds
          } else if (loginResponse.data.redirect === '/verify-otp') {
            router.push(`/OtpVerification?email=${encodeURIComponent(email)}`);
            return; // Exit the loop if OTP verification is required
          }
        } catch (error) {
          console.warn(`IP ${ip} failed: ${error.message || error}`);
        }
      }

      // If no IP succeeds, show an error
      Alert.alert('Error', 'Unable to connect to any backend server. Please try again later.');
    } catch (error) {
      console.error('Login error:', error.message || error);
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