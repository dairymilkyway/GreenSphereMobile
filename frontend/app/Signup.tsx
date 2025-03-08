import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      // Use the hardcoded backend URL
      // const apiUrl = 'http://192.168.48.225:8082/signup';
      const apiUrl = 'http://172.20.10.2:8082/signup';
      const result = await axios.post(apiUrl, { name, email, password }, { withCredentials: true });

      if (result.status === 201) {
        console.log('User created successfully');
        router.push('/Login');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert('Email already exists. Please use another email.');
      } else {
        console.error(err);
      }
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