//Import React Native and options
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import styles from './src/screens/styles';

//Import navigation
import { createStackNavigator } from '@react-navigation/stack'

//Other imports
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

//Import firebase
import { firebase } from './src/firebase/config'

//Import screen compononents 
import { LoginScreen, MainTabs, RegistrationScreen } from './src/screens'


//Define const for navigation
const Stack = createStackNavigator();


//Define App function
export default function App() {

  //Instantiate constants loading and user
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  //Method to automatically connect a previously logged-in user/navigator
  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    console.log(usersRef)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  //Message while loading user's home page
  if (loading) {	
    return (	
      <Text>loading...</Text>	
    )	
  }


  //Return views on condition of user connected (-> MainTabs navigator) or not (Login/Signup)
  return (
    <NavigationContainer>
      <View style={styles.platformContainerTitle}>
        <Text style={styles.title}>Trigram App</Text>
      </View>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        { user ? (
          <Stack.Screen name="MainTabs">
            {props => <MainTabs {...props} extraData={user} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}