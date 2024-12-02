import { Image, StyleSheet, Platform ,Text, TouchableOpacity} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {useRouter} from 'expo-router';
import { auth } from '@/components/firebaseconfig';
import { User } from 'firebase/auth';
import {useFonts} from 'expo-font';
import { getFirestore, doc, getDoc } from 'firebase/firestore';


const [fontsLoaded] = useFonts({
  'MyCustomFont': require('@/assets/fonts/MontserratBold-p781R.otf'), // Path to the .otf file
});


const fetchUserData = async () => {
  const db = getFirestore();
  const user = auth.currentUser;

  if (user) {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        return userData; // Return user data for further use
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  } else {
    console.log('No user is signed in.');
    return null;
  }
};


// auth.signOut().then(() => console.log('Session cleared'));



export default function HomeScreen() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState(true);
  const router = useRouter();
  console.log("uppper")
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log('User is logged in:', currentUser);
        setUser(currentUser);

        // Fetch user data from Firestore
        const data = await fetchUserData();
        setUserData(data);

        // Check if vehicle array is empty
        if (data?.vehicle?.length === 0) {
          setErrorMessage(false);

        } else {
          setErrorMessage(true);
        }
      } else {
        console.log('No user is logged in');
        setUser(null);
        router.push('/login-createScreen'); // Redirect to login screen
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  
    
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        
      </ThemedView>
    );
  }
  //NO VEHICLE FOUND
  if(errorMessage==false){
    return(
      <ThemedView style={styles.container}>
        <ThemedView style={styles.box}>
          <Text style={styles.alertText}>Oops!! You dont have any registered vehicles</Text>
          <TouchableOpacity style={styles.button} >
          <><Text style={styles.buttonText} onPress={()=>{router.push('/userDetails')}}>Add Vehicle</Text></>
        </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    )
  }
  //VEHICLE FOUND
  else{
    return(
      <ThemedView style={styles.container}>cbefb</ThemedView>
    )
  }
  }




  const styles = StyleSheet.create({
    container: {
      flex: 1, // Ensures it takes full height of the screen
      justifyContent: 'center', // Centers content vertically
      alignItems: 'center', // Centers content horizontally
      backgroundColor: '#FFFAE0', // Light background for the entire screen
    },
    box: {
      backgroundColor: '#F1B420', // Yellow background color
      width: 250, // Set a specific width
      height: 150, // Set a specific height
      borderRadius: 15, // Makes the corners rounded
      justifyContent: 'center', // Centers content vertically inside the box
      alignItems: 'center', // Centers content horizontally inside the box
      elevation: 5, // Adds a shadow effect (Android)
      shadowColor: '#000', // Shadow color (iOS)
      shadowOffset: { width: 0, height: 2 }, // Shadow offset (iOS)
      shadowOpacity: 0.3, // Shadow opacity (iOS)
      shadowRadius: 4, // Shadow blur radius (iOS)
    },
    alertText: {
      fontFamily: 'MyCustomFont', // Custom font
      textAlign: 'center', // Horizontally centers the text
      textAlignVertical: 'center', // Vertically centers the text (only for Android)
      color: '#000', // Optional: Black text color for contrast
      fontSize: 16, // Optional: Set font size
      fontWeight: 'bold', // Optional: Make text bold
    },
    button: {
      backgroundColor: '#EF3340', // Green background for the button
      paddingVertical: 10,
      width: '100%', // Button takes full width
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFAE0',
      fontSize: 15,
      // fontWeight: 'bold',
      fontFamily:'MyCustomFont'
    }
  });
  