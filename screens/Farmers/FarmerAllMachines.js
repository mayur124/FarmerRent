import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default class FarmerAllMachines extends React.Component {
  static navigationOptions = {
    title: 'All machines',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#A18F78',
      textAlign: 'center'
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>FarmerAllMachines</Text>
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
