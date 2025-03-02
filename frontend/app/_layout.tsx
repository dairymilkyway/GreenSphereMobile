import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import Header from './header'; // Import from app directory
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Simulate user login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        screenOptions={({ route }) => ({
          headerShown: isLoggedIn && route.name !== 'index', // Show header only if logged in and not on index page
          header: ({ route, options, back }) => (
            <Header
              title={route.name}
              showBackButton={!!back}
              onReload={() => {
                console.log(`Reloading ${route.name}`);
                // Add any global reload logic here
              }}
              backgroundColor="#0F1238"
            />
          ),
        })}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false // Hide header for tab screens if using tab navigation
          }} 
        />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ title: 'Login' }} />
        <Stack.Screen name="Signup" options={{ title: 'Sign Up' }} />
        <Stack.Screen name="OtpVerification" options={{ title: 'OTP Verification' }} />
        <Stack.Screen name="RenewableModel" options={{ title: 'Renewable Models' }} />
        <Stack.Screen name="RenewableInfrastructures" options={{ title: 'Renewable Infrastructures' }} />
        <Stack.Screen name="TechnoEconomicAnalysis" options={{ title: 'Techno Economic Analysis' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}