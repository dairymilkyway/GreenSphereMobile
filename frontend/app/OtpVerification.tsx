import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TextInput, TouchableOpacity, Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import greensphereLogo from '@/assets/images/greenspherelogo.png';

const { width } = Dimensions.get('window');

export default function OtpVerification() {
  const router = useRouter();
  const { email = '' } = useLocalSearchParams();

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isResending, setIsResending] = useState(false);

  const maskEmail = (email) => {
    if (!email.includes('@')) return email;
    const [name, domain] = email.split("@");
    const maskedName = name.substring(0, 2) + "*".repeat(Math.max(0, name.length - 2));
    return `${maskedName}@${domain}`;
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newOtp.join('').length === 6) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (enteredOtp) => {
    try {
      if (!email) {
        setError('Email is missing. Please restart the process.');
        return;
      }
      const response = await axios.post('http://localhost:8082/verify-otp', { email, otp: enteredOtp });
      if (response.status === 200) {
        alert('OTP Verified Successfully!');
        setTimeout(() => router.push('/Login'), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await axios.post('http://localhost:8082/resend-otp', { email });
      alert('New OTP sent to your email!');
      setResendCooldown(30);
    } catch (error) {
      alert('Failed to resend OTP. Please try again.');
    }
    setIsResending(false);
  };

  return (
    <LinearGradient colors={['#05002E', '#191540']} style={styles.container}>
      <View style={styles.formContainer}>
        <Image source={greensphereLogo} style={styles.logo} />
        <Text style={styles.title}>Verify Your OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to <Text style={styles.boldText}>{maskEmail(email)}</Text>.
        </Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={(e) => handleKeyDown(index, e)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity style={styles.verifyButton} onPress={() => handleVerifyOtp(otp.join(''))}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
        <Text style={styles.resendText}>
          Didn't receive a code?  
          {resendCooldown > 0 ? (
            <Text style={styles.resendCooldown}> Resend in {resendCooldown}s</Text>
          ) : (
            <Text 
              onPress={handleResendOtp} 
              style={[styles.resendLink, { cursor: isResending ? 'not-allowed' : 'pointer' }]}
            >
              Resend
            </Text>
          )}
        </Text>
      </View>
    </LinearGradient>
  );
}

// ...existing styles...
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0935' },
  formContainer: { padding: 20, borderRadius: 16, maxWidth: 400, width: '100%', alignItems: 'center', backgroundColor: '#1a1a3c' },
  logo: { width: 150, height: 150, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#bdbdbd', marginBottom: 20, textAlign: 'center' },
  boldText: { fontWeight: 'bold', color: '#ffffff' },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 },
  otpInput: { width: 50, height: 50, textAlign: 'center', fontSize: 22, color: '#ffffff', backgroundColor: '#282852', borderRadius: 8, borderColor: '#6666cc', borderWidth: 1 },
  errorText: { color: 'red', marginBottom: 10 },
  verifyButton: { width: '100%', height: 50, backgroundColor: '#4a47a3', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  resendText: { color: '#bdbdbd', fontSize: 14, textAlign: 'center' },
  resendCooldown: { color: '#8888ff' },
  resendLink: { color: '#8888ff', fontWeight: 'bold' },
});
