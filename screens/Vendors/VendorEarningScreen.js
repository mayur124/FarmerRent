import React from 'react';
import { View, Text, Button, Dimensions } from 'react-native';
import { Card, CardItem } from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';

export default class VendorEarningScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    let currentUser = firebase.auth().currentUser.email;
    currentUser = currentUser.replace(new RegExp('\\.', 'g'), '_');
    const dbRef = firebase.database().ref('farmerBookings');
    dbRef.once('value').then(snapshot => {
      console.log('snapshot values \n', snapshot.val());
      let adObjects = Object.values(snapshot.val());
      adObjects = adObjects.flat();
      console.log('adObjects\n', adObjects);
      let adKeys = Object.keys(snapshot.val());
      let adSubKey = [];
      adKeys.map(item => adSubKey.push(Object.keys(snapshot.val()[item])));
      adSubKey = adSubKey.flat();
    });
  }

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
      <View style={vendorStyles.container}>
        <Card style={{ width: Dimensions.get('screen').width - 10 }}>
          <CardItem>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Summary</Text>
          </CardItem>
          <CardItem>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Total Earnings:{' '}
            </Text>
            <Text style={{ fontSize: 18 }}>&#8377;</Text>
          </CardItem>
          <CardItem style={{ flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Total times your machines are booked:{' '}
            </Text>
            <Text style={{ fontSize: 18 }} />
          </CardItem>
        </Card>

        <Card
          style={{ width: Dimensions.get('screen').width - 10, marginTop: 10 }}
        >
          <CardItem>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Details</Text>
          </CardItem>
          <CardItem>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Booking dates{' '}
            </Text>
          </CardItem>
        </Card>
      </View>
    );
  }
}
