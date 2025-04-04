import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ImageBackground,
  View,
  TextInput,
  Text,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { Video } from 'expo-av';

export default function HomeScreen() {
  const [screen, setScreen] = useState('home');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  // State for sign-up fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [latestUpload, setLatestUpload] = useState({ image: null, location: null });
  // Animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const [selectedRole, setSelectedRole] = useState(null);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    Animated.timing(logoOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }).start(() => {
      Animated.timing(textOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }).start(() => {
        Animated.timing(buttonOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();
      });
    });
  }, []);
  const validateAndLogin = () => {
    setErrorMessage('');
    if (!email.includes('@')) {
      setErrorMessage('Email must contain @');
      return;
    }
    if (password.length < 8 || !/\d/.test(password)) {
      setErrorMessage('Password must be at least 8 characters long and contain at least one number');
      return;
    }
    Alert.alert('Login Successful', `Welcome, ${email}`);
    // Navigate based on selected role
    if (selectedRole === 'Worker') {
      setScreen('workerDashboard');
    } else if (selectedRole === 'Supervisor') {
      setScreen('supervisorDashboard');
    } else {
      setScreen('roleSelection'); // Default to role selection if no role is set
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const validateAndSignUp = () => {
    if (!fullName || !phoneNumber || !email || !occupation || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Email must contain @');
      return;
    }
    if (password.length < 8 || !/\d/.test(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long and contain at least one number');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    Alert.alert('Sign Up Successful', 'Redirecting to Login Page...');
    setScreen('login'); // Redirect to login after successful sign-up
  };
  const takePicture = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take pictures.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const extractLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is required to get image location.');
      return;
    }
  
    let loc = await Location.getCurrentPositionAsync({});
    let reverseGeocode = await Location.reverseGeocodeAsync(loc.coords);
  
    if (reverseGeocode.length > 0) {
      let address = reverseGeocode[0];
  
      setLocation(
        `${address.name ? address.name + ', ' : ''}` +
        `${address.street ? address.street + ', ' : ''}` +
        `${address.postalCode ? address.postalCode + ', ' : ''}` +
        `${address.city ? address.city + ', ' : ''}` +
        `${address.region ? address.region + ', ' : ''}` +
        `${address.country ? address.country : ''}`
      );
    } else {
      setLocation("Location not found");
    }
  };
  const sendOtpToEmail = () => {
    if (!resetEmail.includes('@')) {
      Alert.alert('Error', 'Enter a valid email address');
      return;
    }
    
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(generated);
    Alert.alert('OTP Sent', `Your OTP is: ${generated}`); 
    setScreen('otpVerification');
  };
  
  // Function to verify OTP
  const verifyOtp = () => {
    if (otp === generatedOtp) {
      Alert.alert('Success', 'OTP verified');
      setScreen('resetPassword');
    } else {
      Alert.alert('Error', 'Invalid OTP');
    }
  };
  
  // Function to reset password
  const resetUserPassword = () => {
    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      Alert.alert('Error', 'Password must be at least 8 characters long and contain at least one number');
      return;
    }
  
    Alert.alert('Success', 'Password reset successful');
    setScreen('login'); // Redirect to login
  };
  
  return (
    <ImageBackground source={require('@/assets/images/potholeclick.png')} style={styles.background}>
      {screen === 'home' && (
        <ImageBackground source={require('@/assets/images/potholeclick.png')} style={styles.background}>
          <View style={styles.HomeContainer}>
            <Animated.View style={[styles.container, { opacity: logoOpacity }]}>
              <Animated.Image source={require('@/assets/images/logo.png')} style={[styles.logo, { opacity: logoOpacity }]} />
              <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
                <ThemedText type="title" style={styles.title}>Safe Street</ThemedText>
                <ThemedText type="subtitle" style={styles.tagline}>Making roads safer, one step at a time</ThemedText>
              </Animated.View>
              <Animated.View style={{ opacity: buttonOpacity }}>
                <TouchableOpacity style={styles.startButton} onPress={() => setScreen('roleSelection')}>
                  <ThemedText type="defaultSemiBold" style={styles.buttonText}>Start</ThemedText>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </View>
        </ImageBackground>
      )}
      {screen === 'auth' && (
        <View style={styles.AuthContainer}>
          <ThemedText type="title" style={styles.authTitle}>
            {selectedRole ? `${selectedRole} Authentication` : 'Authentication'}
          </ThemedText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.authButton} onPress={() => setScreen('login')}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>Login</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.authButton} onPress={() => setScreen('signup')}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>Sign Up</ThemedText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('roleSelection')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {screen === 'login' && (
        <View style={styles.LoginContainer}>
          <ThemedText type="title" style={styles.authTitle}>
            {selectedRole ? `${selectedRole} Login` : 'Login'}
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          
          <TouchableOpacity style={styles.submitButton} onPress={validateAndLogin}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Submit</ThemedText>
          </TouchableOpacity>
          {/* Forgot Password */}
          <TouchableOpacity onPress={() => setScreen('forgotPassword')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          {/* Signup Link */}
          <TouchableOpacity onPress={() => setScreen('signup')}>
            <Text style={styles.linkText}>Don't have an account? <Text style={styles.boldText}>Sign up here</Text></Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('auth')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {screen === 'forgotPassword' && (
        <View style={styles.AuthContainer}>
          <ThemedText type="title" style={styles.authTitle}>Forgot Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={resetEmail}
            onChangeText={setResetEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.submitButton} onPress={sendOtpToEmail}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Send OTP</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('login')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {screen === 'otpVerification' && (
        <View style={styles.AuthContainer}>
          <ThemedText type="title" style={styles.authTitle}>Enter OTP</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.submitButton} onPress={verifyOtp}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Verify OTP</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('forgotPassword')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {screen === 'resetPassword' && (
        <View style={styles.AuthContainer}>
          <ThemedText type="title" style={styles.authTitle}>Reset Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.submitButton} onPress={resetUserPassword}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Reset Password</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('login')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {screen === 'signup' && (
        <View style={styles.SignupContainer}>
          <ThemedText type="title" style={styles.authTitle}>
            {selectedRole ? `${selectedRole} Sign Up` : 'Sign Up'}
          </ThemedText>
          <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
          <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Occupation" value={occupation} onChangeText={setOccupation} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
          <TouchableOpacity style={styles.submitButton} onPress={validateAndSignUp}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Submit</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('signup')}>
            <Text style={styles.linkText}>Already have an account? <Text style={styles.boldText}>Login here</Text></Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('auth')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {/* Role Selection */}
      {screen === 'roleSelection' && (
        <View style={styles.roleContainer}>
          <ThemedText type="title" style={styles.authTitle}>Select Your Role</ThemedText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.roleButton} 
              onPress={() => { 
                setSelectedRole('Worker'); 
                setScreen('auth'); 
              }}
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>Worker</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.roleButton} 
              onPress={() => { 
                setSelectedRole('Supervisor'); 
                setScreen('auth'); 
              }}
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>Supervisor</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('home')}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {screen === 'workerDashboard' && (
        <View style={styles.workerDashboardContainer}>
          <ThemedText type="title" style={styles.authTitle}>Worker Dashboard</ThemedText>
          <TouchableOpacity style={styles.submitButton} onPress={() => setScreen('imageUpload')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Upload a Picture</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('roleSelection')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {screen === 'imageUpload' && (
        <View style={styles.imageUploadContainer}>
          {!image && (
            <>
              <TouchableOpacity style={styles.submitButton} onPress={takePicture}>
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Take Picture</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={pickImage}>
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Upload from Device</ThemedText>
              </TouchableOpacity>
            </>
          )}
          {image && (
            <View>
              <Image source={{ uri: image }} style={styles.previewImage} />
              
              {/* 🔄 Retake Button */}
              <TouchableOpacity style={styles.submitButton} onPress={() => setImage(null)}>
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Retake</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={extractLocation}>
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Get Location</ThemedText>
              </TouchableOpacity>
            </View>
          )}
          {location && (
            <View>
              <Text style={styles.locationText}>Location: {location}</Text>
              
              {/* 📤 Upload Button */}
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={() => {
                  if (!image || !location) {
                    Alert.alert("Error", "Please select an image and extract location before uploading.");
                    return;
                  }
                  setLatestUpload({ image, location });  // Store the uploaded image and location
                  Alert.alert("Success", "Sent to the Supervisor");  // Confirm upload
                  setScreen('workerDashboard');  // Redirect back to Worker Dashboard
                }}
              >
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Upload</ThemedText>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('workerDashboard')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {/* Supervisor Dashboard */}
      {screen === 'supervisorDashboard' && (
        <View style={styles.supervisorDashboardContainer}>
          <ThemedText type="title" style={styles.authTitle}>Supervisor Dashboard</ThemedText>
          {latestUpload.image ? (
            <View>
              <Image source={{ uri: latestUpload.image }} style={styles.previewImage} />
              <Text style={styles.locationText}>Latest Upload: {latestUpload.location}</Text>
              <TouchableOpacity 
                style={styles.openButton} 
                onPress={() => setScreen('supervisorView')}
              >
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>Open</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>No uploads available</Text>
          )}
          <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('roleSelection')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {/* Supervisor View Page - Displays Image & Location */}
      {screen === 'supervisorView' && latestUpload.image && (
        <View style={styles.supervisorViewContainer}>
          <Image source={{ uri: latestUpload.image }} style={styles.previewImage} />
          <Text style={styles.locationText}>Location: {latestUpload.location}</Text>
          {/* <TouchableOpacity 
            style={styles.authBackButton} 
            onPress={() => setScreen('supervisorDashboard')}
          >
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.authBackButton} onPress={() => setScreen('supervisorDashboard')}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
  container: { width: '60%', height: '50%', padding: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  authContainer: { width: '50%', height: '50%', padding: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15 },
  authButton: { backgroundColor: 'green', width: 120, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  authBackButton: { marginTop: 20, backgroundColor: 'red', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 8, alignSelf: 'center' },
  authTitle: {fontSize: 28,fontWeight: 'bold', color: 'white', textAlign: 'center',},
  roleButton: { backgroundColor: 'green', width: 140, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  input: { width: '80%', height: 40, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, marginVertical: 8 },
  submitButton: { marginTop: 10, backgroundColor: 'green', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 8 },
  errorText: { color: 'white', marginBottom: 10, fontSize: 14 }, // 🔹 Updated to white
  startButton: { marginTop: 20, backgroundColor: 'green', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8 },
  backButton: { marginTop: 20, backgroundColor: 'red', paddingVertical: 8, paddingHorizontal: 30, borderRadius: 6 },
  tagline: { fontSize: 16, color: 'white', marginTop: 5, textAlign: 'center' }, // 🔹 Updated to white
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' }, // 🔹 Updated to white
  buttonText: { color: 'white', fontSize: 16 }, // 🔹 Ensuring all button text is white
  locationText: { marginTop: 10, fontSize: 16, color: 'white' }, // 🔹 Updated to white
  previewImage: { width: 200, height: 200, marginVertical: 10 },
  removeButton: { marginTop: 10, backgroundColor: 'blue', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 8, alignItems: 'center' },
  uploadButton: { marginTop: 10, backgroundColor: 'green', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 8, alignItems: 'center' },
  openButton: { marginTop: 10, backgroundColor: 'blue', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 8, alignItems: 'center' },
  logo: {width: 120,height: 120,borderRadius: 60,marginBottom: 20,}, 
  HomeContainer: {width: '90%',padding: 20,backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 15, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },shadowOpacity: 0.3,shadowRadius: 5,},
  roleContainer: {width: '90%',padding: 20,backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 15, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },shadowOpacity: 0.3,shadowRadius: 5,},
  AuthContainer: {width: '90%', maxWidth: 400, padding: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,},
  LoginContainer: {width: '90%', maxWidth: 400, padding: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,},
  SignupContainer: {width: '90%', maxWidth: 400, padding: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,},
  workerDashboardContainer: {width: '90%', maxWidth: 400, padding: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,},
  imageUploadContainer: {width: '90%', maxWidth: 400, padding: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,},
  supervisorDashboardContainer: {width: '90%', maxWidth: 400, padding: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,},
  supervisorViewContainer: {width: '90%', maxWidth: 400, padding: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,},
  linkText: {color: 'white'},
  overlay: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)', width: '100%', height: '100%',},
  videoBackground: {
    position: 'absolute', // Places it behind other elements
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1, // Ensures it stays in the background
  },
  // roleContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.4)', // Optional: Adds a semi-transparent overlay
  // },
});