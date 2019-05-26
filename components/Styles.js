import {StyleSheet, Dimensions} from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',       
    },
    cardContainer: {
        width: Dimensions.get('screen').width-30, 
        paddingBottom: 25
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        //color: "#0A3D62",
        color: "#D9AE3C",
        textAlign: "center"
    },
    formContainer: {
        paddingRight: 15,
    },
    input:{
        //width: Dimensions.get('screen').width,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 18,
        borderRadius: 2,
        borderColor: "#EAF0F1",
        backgroundColor: "#f4f4f4",
        borderWidth: 1,
        marginBottom: 10,
    },
    inputRegister: {
        marginRight: 15
    },
    loginButton: {
        marginTop: 10,
        alignSelf: "center",
        width: "90%",
        backgroundColor: "#453421",
    },
    picker: {
        marginTop: 5, 
        alignSelf: "flex-start",
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 2,
        borderColor: "#EAF0F1",
        backgroundColor: "#f4f4f4",
        borderWidth: 1,
        marginBottom: 10,
        width: "95%",
    },  
});

const vendorStyles = {
    container: {
        flex: 1,
        alignItems: "center"
    },
    heading: {
        marginTop: 10,
        fontSize: 25,
    },
    button: {
        backgroundColor: "#453421", 
        padding: 10, 
        marginTop: 5,
        alignSelf: "center",
    },
    buttonText: {
        color: "#D9AE3C", 
        fontWeight: "bold",
        alignItems: "center",
    }
}

export {styles, vendorStyles}