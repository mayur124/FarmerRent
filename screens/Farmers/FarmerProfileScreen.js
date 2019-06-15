import React from 'react';
import { View, Text, Button } from 'react-native';
import {styles} from '../../components/Styles'
import * as firebase from 'firebase'

export default class FarmerProfileScreen extends React.Component {
  static navigationOptions = {header: null}

  signOut = () => {
    firebase.auth().signOut()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>FarmerProfileScreen</Text>
        <Button title="Sign out" onPress={()=>this.signOut()} />
      </View>
    );
  }
}

