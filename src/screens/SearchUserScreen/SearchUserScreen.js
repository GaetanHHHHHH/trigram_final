//Import React (Native)
import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native'

//Import navigation to be able to move to user's profile
import { useNavigation } from '@react-navigation/native';

//Import styles and db
import styles from './styles';
import { firebase } from '../../firebase/config'


//Define function for searching users
export default function SearchUserScreen() {

    //Define const for input (search) and users corresponding to input
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')

    //Define const for users in db and navigation
    const userRef = firebase.firestore().collection('users')
    const navigation = useNavigation()
    navigation.setOptions({ headerShown: false })

    //Define const to track input change and add users to [users]
    const searchInputChange = () => {
        userRef
            //If search value equals a user's fullname, add him to list
            .where("fullName", "==", search)
            .onSnapshot(
                querySnapshot => {
                    const newUsers = []
                    querySnapshot.forEach(doc => {
                        const user = doc.data()
                        user.id = doc.id
                        newUsers.push(user)
                    });
                    setUsers(newUsers)
                },
                error => {
                    console.log(error)
                }
            )
    }

    //Define const to navigate to user's profile and keep track of his identity
    const onUserProfileLinkPress = (user) => {
        const userId = user.id
        const userName = user.fullName
        navigation.navigate('UserProfileScreen', { userId: userId, userName: userName })
    }

    //Define const to render username and link after successful search in db
    const renderUser = ({ item }) => {
        console.log(item.id)
        return (
            <View style={styles.entityContainer}>
                <TouchableOpacity
                    onPress={() => onUserProfileLinkPress(item)}>
                    <Text style={styles.userLink}>{item.fullName}</Text>
                </TouchableOpacity>
            </View>

        )
    }

    
    //Return view (input (search), button, & username and link to profile via renderUser)
    return (
        <View style={styles.listContainer}>
            <View>
                <Text style={styles.title}>
                    Rechercher un utilisateur
                </Text> 
            </View>
            <TextInput
                style={styles.entityText}
                placeholder="Nom de l'utilisateur"
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setSearch(text)}
                value={search}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={searchInputChange}>
                <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
            <FlatList
                removeClippedSubviews={true}
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={renderUser}
            />
        </View>
    )


}