import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen(props) {

    const [entities, setEntities] = useState([])

    const entityRef = firebase.firestore().collection('entities').orderBy("createdAt", "desc")
    
    const ownID = firebase.auth().currentUser.uid;
    const userID = props.extraData.id
    const userName = props.extraData.fullName
    const following = props.extraData.following

    var newPost = false
    const lastConnected = props.extraData.lastConnected
    let newEntities = []

    const isNewPost = (entity) => {
        if (entity.createdAt > lastConnected) {
            return <Text style={styles.alert}>Nouveau post !</Text>
        }
    }


    const navigation = useNavigation()

    const [isLiked, setisLiked] = useState(false)
    const [hasLike, setHasLike] = useState(false);

    useEffect(() => {
        for (let user in following) {
            entityRef
                .where("authorID", "==", following[user])
                .onSnapshot(
                    querySnapshot => {
                        querySnapshot.forEach(doc => {
                            const entity = doc.data()
                            entity.id = doc.id
                            newEntities.push(entity)
                            //sort new entities by createdAt
                            newEntities.sort((a, b) => {
                                return b.createdAt - a.createdAt
                            });
                        });
                        setEntities(newEntities)
                        return
                    },
                    error => {
                        console.log(error)
                    }
                )
        }
    }, [])


    //to like and unlike an entity
    function removeItemFromArr(arr, value) { 
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

    const renderEntity = ({ item }) => {
        console.log("ok");
        return (
            <ScrollView style={styles.entityContainer}>
                {isNewPost(item)}
                <Text style={styles.entityText}>
                    {item.title}
                </Text>
                <Text style={styles.entityTitle}>
                    {item.text}
                </Text>
                <TouchableOpacity>
                    <Text style={styles.entityText}>Posté par : {item.authorName}</Text>
                </TouchableOpacity>
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

    return (

        <ScrollView style={styles.listContainer}>
            <View style={styles.buttonTitle}>
                <Text style={styles.title}>
                    Bienvenue {userName} !
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => firebase.auth().signOut()}>
                    <Text style={styles.buttonText}>Se déconnecter</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.title2}>
                Derniers posts
            </Text>
            <FlatList
                data={entities}
                renderItem={renderEntity}
                keyExtractor={(item) => item._id}
            />
        </ScrollView>
    )
}