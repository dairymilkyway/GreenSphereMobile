import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hardcoded backend URL
  const apiUrl = 'http://172.20.10.2:8082/login';

  const handleLogin = async () => {
    try {
      const loginResponse = await axios.post(apiUrl, { email, password }, { withCredentials: true });
      console.log('Login response:', loginResponse.data); // Debugging
      if (loginResponse.data.message === 'Success') {
        router.replace(loginResponse.data.role === 'admin' ? '/adminhome' : '/home');
      } else if (loginResponse.data.redirect === '/verify-otp') {
        router.push(`/OtpVerification?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
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
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <ThemedText style={styles.buttonText}>Log in</ThemedText>
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