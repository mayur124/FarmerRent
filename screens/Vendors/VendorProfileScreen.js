import React from 'react';
import { View, Text, Button } from 'react-native';
import {styles} from '../../components/Styles'
import * as firebase from 'firebase'

export default class VendorProfileScreen extends React.Component {
  static navigationOptions = {title: "Profile"}

  signOut = () => {
    firebase.auth().signOut()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>VendorEquipmentScreen</Text>
        <Button title="Sign out" onPress={()=>this.signOut()} />
      </View>
    );
  }
}

