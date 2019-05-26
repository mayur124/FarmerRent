import React from 'react';
import { View, Text } from 'react-native';
import {styles} from '../../components/Styles'

export default class VendorMachineDescriptionScreen extends React.Component {
    static navigationOptions = {
        title: "Machine Description",
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold", 
          color: "#D9AE3C",
          textAlign: "center"
        },
      }

  render() {
    return (
      <View style={styles.container}>
        <Text>VendorMachineDescriptionScreen</Text>
      </View>
    );
  }
}

