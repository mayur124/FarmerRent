import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Item, Card, CardItem, Icon, Form, Input, Label, Button } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from '../components/Styles'
import * as firebase from 'firebase'

export default class SignInScreen extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={
            email: "",
            password: ""
        }
    }

    static navigationOptions ={
        title: "SignIn",
        header: null
    }
    
    loginWithEmail = (email, password) => {
        
    }
    render() {
        return (

            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View>
                <Text style={[styles.heading, {fontSize: 30, marginBottom: 10, textAlign: "center"}]}>Welcome</Text>
                
                <Card style={styles.cardContainer}>
                    <CardItem header bordered style={{backgroundColor: "#453421"}}>
                        <Text style={styles.heading}>Sign in</Text>
                    </CardItem>
                    <Form style={styles.formContainer}>
                        <Item style={{marginTop: 20}}>
                            <Input 
                                placeholder="Username"
                                style={styles.input}
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="name-phone-pad"
                                onChangeText={email=>this.setState({email})}
                                />
                        </Item>
                        <Item>
                            <Input 
                                placeholder="Password"
                                style={styles.input}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={password=>this.setState({password})}/>
                        </Item>
                        <Button 
                            block
                            style={styles.loginButton}
                            onPress={()=>{this.loginWithEmail(this.state.email, this.state.password)}}>
                            <Text style={{color: "#D9AE3C", fontWeight: "bold"}}>Login</Text>
                        </Button>
                    </Form>
                    
                    <TouchableOpacity style={{marginTop: 20, alignSelf: "center"}}
                        onPress={()=>{this.props.navigation.navigate("SignUp")}}
                    >
                        <Text style={{color: "#0A79DF", fontWeight: "bold"}}>Create Account</Text>
                    </TouchableOpacity>
                </Card>
            </View>
            </KeyboardAwareScrollView>
        );
        /*
        <Card style={styles.socialContainer}>
            <CardItem bordered>
                <TouchableOpacity style={styles.socialButtons}>
                    <Icon style={{color: "#0A3D62"}} active name="logo-google"/>
                    <Text style={{marginTop: 7, color: "#0A3D62"}}>Sign in with Google</Text>
                </TouchableOpacity>
            </CardItem>
            <CardItem bordered>
                <TouchableOpacity style={styles.socialButtons}>
                    <Icon style={{color: "#0A3D62"}} active name="logo-facebook" />
                    <Text style={{marginTop: 7, color: "#0A3D62"}}>Sign in with Facebook</Text>
                </TouchableOpacity>
            </CardItem>
        </Card>
        */
    }
}



