import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default class FarmerMachineDetail extends React.Component {
  static navigationOptions = {
    title: 'Details',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#A18F78',
      textAlign: 'center'
    }
  };
  componentDidMount() {
    console.log(this.props.navigation.getParam('item'));
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>FarmerMachineDetail</Text>
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
