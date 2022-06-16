import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    paragraph: {
      color: "black",
      textDecorationColor: "yellow",
      textShadowColor: "red",
      textShadowRadius: 1,
      margin: 24
    },
    wrapperHorizontal: {
      height: 54,
      justifyContent: "center",
      color: "black",
      marginBottom: 12
    },
    itemStyleHorizontal: {
      marginRight: 10,
      height: 50,
      padding: 8,
      borderWidth: 1,
      borderColor: "grey",
      borderRadius: 25,
      textAlign: "center",
      justifyContent: "center"
    },
    itemSelectedStyleHorizontal: {
      borderWidth: 2,
      borderColor: "#DAA520"
    },
    platformContainer: {
      marginTop: 8,
      borderTopWidth: 1
    },
    platformContainerTitle: {
    marginVertical: 20,
    textAlign: "center",
    justifyContent: "center",
    },
    title: {
      fontWeight: "bold",
      fontSize: 20
    }
  });