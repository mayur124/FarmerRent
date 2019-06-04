import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default class VendorMachineDetail extends React.Component {
  static navigationOptions = {
    title: 'Your Machines',
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
        <Text>VendorMachineDetail</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
