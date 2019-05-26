import React from 'react';
import { View, Text } from 'react-native';
import {styles} from '../../components/Styles'

export default class VendorBookingsScreen extends React.Component {
  static navigationOptions = {title: "Bookings"}

  render() {
    return (
      <View style={styles.container}>
        <Text>VendorBookingsScreen</Text>
      </View>
    );
  }
}

