import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../components/Styles';

export default class VendorBookingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Bookings',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>VendorBookingsScreen</Text>
      </View>
    );
  }
}
