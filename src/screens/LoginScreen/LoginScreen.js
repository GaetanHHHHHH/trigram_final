//Import React (Native)
import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//Import styles and db
import styles from './styles';
import { firebase } from '../../firebase/config'

//Define loginscreen functions with navigation to link to other screens
export default function LoginScreen({navigation}) {

    //Define const for input
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //Define const to move to registration screen if user has not account yet
    const onFooterLinkPress = () => {
        navigation.navigate('RegistrationScreen')
    }

    //Define const to login the user based on email and password
    const onLoginPress = () => {

        //Use firebase functions to check email and password
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {

                //Get the user in the db
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {

                        //Verify if user still exists
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }

                        //Assigns user to const and use it to navigate to user's homescreen
                        const user = firestoreDocument.data()
                        navigation.push('HomeScreen', {user})
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
        }

    //Return view (form and buttons)
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                {/* <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                /> */}
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}