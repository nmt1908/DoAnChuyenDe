import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Simulate loading (e.g., check user login status)
    setTimeout(() => {
      navigation.navigate('LoginScreen');
    }, 2000);  // Adjust the duration as needed
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logoCam.png')} style={styles.logo} />
      
      {/* Spinning circle for loading */}
      <ActivityIndicator size="large" color="#ffffff" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EE4D2D',  // Background color for the splash screen
  },
  logo: {
    width: 300,  // Adjust the logo size as needed
    height: 300,
    resizeMode: 'contain',
    marginBottom: 30,  // Spacing between the logo and the spinner
  },
  spinner: {
    marginTop: 20,  // Adjust spacing as needed
  },
});
