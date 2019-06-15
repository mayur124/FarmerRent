import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';
export default class FarmerMachineDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adObject: {}
    };
  }

  static navigationOptions = {
    title: 'Details',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#A18F78',
      textAlign: 'center'
    }
  };
  async componentDidMount() {
    await this.setState({ adObject: this.props.navigation.getParam('item') });
    console.log(this.state.adObject.key);
    const dbRef = firebase.database().ref('vendorAds');
    dbRef.once('value', snapshot => {
      const vendorKeys = Object.keys(snapshot.val());
      vendorKeys.map(email => console.log(snapshot.val()[email].vendorEmail));
    });
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
