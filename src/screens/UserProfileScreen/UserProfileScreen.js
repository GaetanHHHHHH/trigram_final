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
    // const [entityID, setEntityID] = useState("");

    const [isFollow, setisFollow] = useState(false);
    const [isLiked, setisLiked] = useState(false);
    const [followList, setFollowList] = useState([]);
    
    const isNotUserID = (currentValue) => currentValue !== userID;

    const [hasLike, setHasLike] = useState(false);

    //Get following list for the currently logged user
    const getFollowing = async () => {
        var db = firebase.firestore()
        //console.log(following2.filter(isNotUserID));     
        if (following2.includes(userID)) {
            const followlist = following2.filter(isNotUserID);
            setisFollow(false);
            db.collection("users").doc(ownID).update({ following: followlist });
        } else {
            following2.push(userID)
            setisFollow(true);
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

    function removeItemFromArr(arr, value) { //barbaric, but it works -- removes like
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }

    //add a like to the post
    const addLike = async (entityID) => {
        var db = firebase.firestore()
        var docRef = db.collection("entities").doc(entityID)
        docRef.get().then(function (doc) {
            if (doc.exists) {
                const entity = doc.data()
                const likes = entity.likes
                if (likes.includes(ownID)) {
                    const newLikes = removeItemFromArr(likes, ownID)
                    docRef.update({ likes: newLikes })
                    setisLiked(false);
                } else {
                    likes.push(ownID)
                    docRef.update({ likes: likes })
                    setisLiked(true);
                }
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        }
        )
    }

    

    const renderLikeText = (entityID) => {
        //get entity ID from the post
        // isLiked = checkLike(entityID)
        if (isLiked) {
        return <TouchableOpacity style={styles.button} onPress={() => addLike(entityID)}>
            <Text style={styles.buttonText}>
                unlike
            </Text>
        </TouchableOpacity>
        } else {
        console.log("not liked yet")
        return <TouchableOpacity style={styles.button} onPress={() => addLike(entityID)}>
            <Text style={styles.buttonText}>
                like
            </Text>
        </TouchableOpacity>
        }
    }


        const renderFollowText = () => {
            if (isFollow){ return <TouchableOpacity style={styles.button} onPress={() => getFollowing()}>
                <Text style={styles.buttonText}>
                    Unfollow
                </Text>
            </TouchableOpacity>}
            else{ return (<TouchableOpacity style={styles.button} onPress={() => getFollowing()}>
                <Text style={styles.buttonText}>
                    Follow
                </Text>
            </TouchableOpacity>);
            }
        }


        //Render all his posts on the page
        const renderEntity = ({ item }) => {
            // if(item.likes.includes(ownID)){ 
            //     setisLiked(true)
            // }else{
            //     setisLiked(false)
            // }
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
                        {renderLikeText(item.id)}
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