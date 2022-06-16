//Import React (Native)
import React, { useEffect, useState } from 'react'
import { FlatList, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'

//Import navigation to get user from search
import { useRoute } from '@react-navigation/native';

//Import styles and db
import styles from './styles';
import { firebase } from '../../firebase/config'


//Define function to show user's profile and all his posts
export default function UserProfileScreen() {

    //Create const for posts
    const [entities, setEntities] = useState([])
    const entityRef = firebase.firestore().collection('entities')

    //Create const for navigation
    const route = useRoute()

    //Get user's ID from SearchUserScreen
    const userID = route.params.userId
    const userName = route.params.userName

    //Create constant for follow button
    const ownID = firebase.auth().currentUser.uid;
    const [following2, setFollowing2] = useState([]);

    const [isFollow, setisFollow] = useState(false);
    const [followList, setFollowList] = useState([]);


    //Get following list for the currently logged user
    const getFollowing = async () => {
        var db = firebase.firestore()
        let followedPersons = following2
        if (following2.includes(userID)) {
            following2.pop(userID)
            setisFollow(false);
            console.log("Personne unfollowed !")
            console.log(following2)
            db.collection("users").doc(ownID).update({ following: following2 });
        } else {
            following2.push(userID)
            setisFollow(true);
            console.log("Personne followed !")
            console.log(following2)
            db.collection("users").doc(ownID).update({ following: following2 });
        }
        []
    }


    //Get all user's posts from db thanks to his ID
    useEffect(() => {
        entityRef
            .where("authorID", "==", userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newEntities = []
                    querySnapshot.forEach(doc => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    setEntities(newEntities)
                },
                error => {
                    console.log(error)
                },
            )
        const userRef = firebase.firestore().collection('users')
        userRef
            .where("id", "==", ownID)
            .onSnapshot(
                querySnapshot => {
                    let followingList = []
                    querySnapshot.forEach(doc => {
                        const user = doc.data()
                        followingList = user.following
                        setFollowing2(followingList)
                        if (followingList.includes(userID)) {
                            setisFollow(true);
                        } else {
                            setisFollow(false);
                    }
                    });
            },
                error => {
                    console.log(error)
                },
            )
    }, [])


    const renderFollowText = () => {
        if (isFollow) return <TouchableOpacity style={styles.button} onPress={() => getFollowing()}>
            <Text style={styles.buttonText}>
                Unfollow
            </Text>
        </TouchableOpacity>
        else return (<TouchableOpacity style={styles.button} onPress={() => getFollowing()}>
            <Text style={styles.buttonText}>
                Follow
            </Text>
        </TouchableOpacity>);
    }


    //Render all his posts on the page
    const renderEntity = ({ item }) => {
        console.log(isFollow)
        return (
            <ScrollView style={styles.entityContainer}>
                <Text style={styles.entityTitle}>
                    {item.title}
                </Text>
                <Text style={styles.entityText}>
                    {item.text}
                </Text>
                {item.image ? (
                    <Image style={{ width: '300px', height: '300px' }} source={{ uri: item.image }}></Image>
                ) : (
                    // Evite les bugs d'affichage sur iOS
                    <Text>Pas d'image</Text>
                )}
            </ScrollView>
        )
    }


    //Return a view (all posts)
    return (
        <ScrollView style={styles.listContainer}>
            <View>
                <Text style={styles.title}>
                    Publications de {userName}
                </Text>
                {renderFollowText()}
            </View>
            <FlatList
                data={entities}
                renderItem={renderEntity}
                keyExtractor={(item) => item.id}
                removeClippedSubviews={true}
            />
        </ScrollView>
    )
}