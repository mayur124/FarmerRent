import React from 'react';
import { View, Text } from 'react-native';
import {styles} from '../../components/Styles'

export default class FarmerTransactionHistoryScreen extends React.Component {
  static navigationOptions = {header: null}

  render() {
    return (
      <View style={styles.container}>
        <Text>FarmerTransactionHistoryScreen</Text>
      </View>
    );
  }
}

