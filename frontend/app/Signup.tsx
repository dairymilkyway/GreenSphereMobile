import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import config from './config'; // Import the configuration file

const { width } = Dimensions.get('window');

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      // Iterate through the IP list and attempt signup with each IP
      for (const ip of config.ipList) {
        const apiUrl = `http://${ip}/signup`;
        try {
          console.log(`Attempting signup with IP: ${ip}`);
          const result = await axios.post(
            apiUrl,
            { name, email, password },
            { withCredentials: true, timeout: 500 } // Timeout after 0.5 seconds
          );

          if (result.status === 201) {
            console.log('User created successfully');
            router.push('/Login');
            return; // Exit the loop if signup succeeds
          }
        } catch (error) {
          console.warn(`IP ${ip} failed: ${error.message || error}`);
        }
      }

      // If no IP succeeds, show an error
      Alert.alert('Error', 'Unable to connect to any backend server. Please try again later.');
    } catch (err) {
      console.error(err);
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
          <ThemedText type="title" style={styles.title}>Create an account</ThemedText>
          <ThemedText style={styles.subtitle}>Let’s get started!</ThemedText>
          
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#CCCCCC"
            value={name}
            onChangeText={setName}
          />
          
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
          
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <ThemedText style={styles.buttonText}>Sign up</ThemedText>
          </TouchableOpacity>
          
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