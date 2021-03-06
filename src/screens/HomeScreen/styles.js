import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginTop: 40,
        marginBottom: 20,
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5
    },
    button: {
        height: 30,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 140,
        alignItems: "center",
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    alert: {
        fontSize: 20,
        color: '#FF0000',
        marginTop: 20
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 30
    },
    entityText: {
        fontSize: 20,
        color: '#333333'
    },
    title: {
        fontSize: 30,
        color: '#788eec',
        borderTopColor: '#cccccc',
        borderTopWidth: 3,
        marginTop: 20
    },
    title2: {
        fontSize: 30,
        color: '#788eec',
    },
    buttonTitle: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 3,
        marginBottom: 20
    }
})