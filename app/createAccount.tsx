import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Text, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth,db } from '@/components/firebaseconfig'; // Ensure firebase is set up
import { doc, setDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window'); // Get screen width and height

export default function CreateAccountScreen() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [role,setRole] = useState('user');
  const [vehicle,setVehicle] = useState([])
  const router = useRouter();

  const handleCreateAccount = async () => {
    console.log("func tripped");
    if (password !== confirmPassword){
      setErrorMessage("Passwords don't match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;

      console.log('User created successfully:', user);
      // Save additional user details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        phoneNumber,
        organization,
        email,
        role,
        vehicle,
        createdAt: new Date().toISOString(),
      });

      console.log('User details saved to Firestore');

      router.push('/login-createScreen');
    }
    catch(error){
      setErrorMessage(error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
        <Image
            source={require('@/assets/images/ZenPark_Transparent.png')}
            style={styles.logo}
        />
        <ThemedView style={styles.formBox}>
            <Text style={styles.createAccount}>Create Account</Text>

            {/* Full Name Input */}
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
            />

            {/* Phone Number Input */}
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                keyboardType="phone-pad" // Ensures numeric input
            />

            {/* Organization Input */}
            <TextInput
                style={styles.input}
                placeholder="Organization"
                value={organization}
                onChangeText={setOrganization}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
            />

            {/* Email Input */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                keyboardType="email-address" // Email keyboard for easier input
            />

            {/* Password Input */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                secureTextEntry // Ensures password is hidden
            />

            {/* Confirm Password Input */}
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                secureTextEntry // Ensures password confirmation is hidden
            />

            {/* Error Message */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {/* Create Account Button */}
            <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            {/* Navigate to Login Screen */}
            <TouchableOpacity onPress={() => router.push('/login-createScreen')}>
                <Text style={styles.loginText}>Have an account?</Text>
            </TouchableOpacity>
        </ThemedView>
    </ThemedView>
);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fffae0", // Light yellow background
    flex: 1, // Ensures the container fills the screen
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center',
    padding: 20, // Adds padding around the container
  },
  formBox: {
    backgroundColor: "#000C20", // Dark background for the form
    justifyContent: 'center',
    alignItems: 'center', // Center content within the box
    borderRadius: 15, // Rounded corners
    width: width * 0.8, // 80% of the screen width
    height: height * 0.7, // Increased height to fit inputs
    padding: 20, // Add some padding to ensure content doesn't touch the edges
  },
  logo: {
    width: width * 0.5, // 50% of the screen width
    height: height * 0.2, // 20% of the screen height
    resizeMode: 'contain', // Ensures the logo maintains its aspect ratio
    margin:0 // Adds space below the logo
  },
  createAccount: {
    fontSize: 22,
    marginBottom: 20, // Adds space between the text and input fields
    color: "#fff",
    fontFamily: 'MyCustomFont', // Custom font
  },
  input: {
    width: '100%', // Takes full width of the form box
    height: 40, // Fixed height for the input fields
    backgroundColor: '#FFFAE0', // Light background color
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15, // Adds space between input fields
    fontFamily: 'MyCustomFont', // Custom font
  },
  button: {
    backgroundColor: '#EF3340', // Red background for the button
    paddingVertical: 10,
    width: '100%', // Button takes full width
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFAE0',
    fontSize: 16,
    fontFamily: 'MyCustomFont', // Custom font
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'MyCustomFont',
  },
  loginText: {
    color: '#FFFAE0',
    marginTop: 15,
    fontFamily: 'MyCustomFont',
    
  },
});
