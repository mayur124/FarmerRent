import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default class FarmerSearchMachines_StCtyPn extends React.Component {
  static navigationOptions = {
    title: 'Search',
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
        <Text>{this.props.navigation.getParam('searchType')}</Text>
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
