import React from 'react';
import { View, Text, Button } from 'react-native';
import { styles } from '../../components/Styles';

export default class VendorEarningScreen extends React.Component {
  static navigationOptions = {
    title: 'Earnings',
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
        <Text>VendorEarningScreen</Text>
        <Button title='Back' onPress={() => this.props.navigation.goBack()} />
      </View>
    );
  }
}
