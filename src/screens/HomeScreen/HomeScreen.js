import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen(props) {

    const [entities, setEntities] = useState([])

    const entityRef = firebase.firestore().collection('entities')
    const userID = props.extraData.id
    const userName = props.extraData.fullName
    const following = props.extraData.following
    let newEntities = []

    const navigation = useNavigation()


    useEffect(() => {
        for (let user in following) {
            entityRef
                .where("authorID", "==", following[user])
                .orderBy('createdAt', 'desc')
                .onSnapshot(
                    querySnapshot => {
                        querySnapshot.forEach(doc => {
                            const entity = doc.data()
                            entity.id = doc.id
                            newEntities.push(entity)
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


    const renderEntity = ({ item }) => {
        console.log(item)
        return (
            <ScrollView style={styles.entityContainer}>
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