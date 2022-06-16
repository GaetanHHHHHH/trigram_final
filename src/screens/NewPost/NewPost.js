//Import React (Native)
import React, { useState } from 'react'
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'

//Import styles and db
import styles from './styles';
import { firebase } from '../../firebase/config'


//Define function to add new post ("post" === "entities" in db)
export default function NewPost(props) {

    //Create const for input
    const [entityTitle, setEntityTitle] = useState('')
    const [entityText, setEntityText] = useState('')
    const [entityImage, setEntityImage] = useState('')

    //Create const for entities in db, and to get user from login screen (nested navigators)
    const entityRef = firebase.firestore().collection('entities')
    const userID = props.extraData.id
    const userName = props.extraData.fullName


    //Define const for creating post
    const onAddButtonPress = () => {

        //Check if title and text are inputted
        if (entityText && entityText.length > 0 && entityTitle && entityTitle.length > 0) {
            
            //Create const for timestamp (creation date) and const for data
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                title: entityTitle,
                text: entityText,
                image: entityImage,
                authorID: userID,
                authorName: userName,
                createdAt: timestamp
            };

            //Add input to db
            entityRef
                .add(data)

                //Reset form to no input values and make keyboard disappear
                .then(_doc => {
                    setEntityText('')
                    setEntityTitle('')
                    setEntityImage('')
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    //Return view (form and button)
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>
                    Ajouter un nouveau post
                </Text> 
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Titre du post'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(title) => setEntityTitle(title)}
                    value={entityTitle}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='Texte'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(texte) => setEntityText(texte)}
                    value={entityText}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="URL de l'image (optionnel)"
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(url) => setEntityImage(url)}
                    value={entityImage}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Valider</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}