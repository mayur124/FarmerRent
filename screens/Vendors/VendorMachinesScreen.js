import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList
} from 'react-native';
import { Card, Button, Input, Item, CardItem } from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';

export default class VendorMachineScreen extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      hasPostedAnyAd: null,
      adObject: {}
    };
    _isActive = true;
  }

  componentDidMount() {
    this._isMounted = true;
    let currentFirebaseVendor = firebase
      .auth()
      .currentUser.email.replace(new RegExp('\\.', 'g'), '_');
    // console.log(currentFirebaseVendor);

    if ((this._isMounted = true)) {
      let dbReference = firebase.database().ref('vendorAds');
      dbReference.once('value', snapshot => {
        let vendors = Object.keys(snapshot.val());
        let currentVendor_Array = vendors.filter(
          vendor => vendor === currentFirebaseVendor
        );
        // console.log(currentVendor[0]);
        let currentVendor = currentVendor_Array[0];
        if (currentVendor.length) {
          this.setState({ hasPostedAnyAd: true });
        } else {
          this.setState({ hasPostedAnyAd: false });
        }
        dbReference
          .child(currentVendor)
          .once('value', async vendorAdDetails => {
            let tempAdObject = vendorAdDetails.exportVal();
            await this.setState({ adObject: tempAdObject });
            console.log('this.state.adObject: ', this.state.adObject);
            // console.log(Object.entries(this.state.adObject).length);
          });
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

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
    if (
      this.state.hasPostedAnyAd === null ||
      Object.entries(this.state.adObject).length === 0
    ) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
          <Text>Loading</Text>
        </View>
      );
    }

    if (this.state.hasPostedAnyAd === false) {
      return (
        <View style={styles.container}>
          <Text
            style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}
          >
            You have not posted any machines
          </Text>
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={vendorStyles.container}>
          <Card
            style={{
              width: Dimensions.get('screen').width - 20
            }}
          >
            <CardItem>
              <Item style={[styles.formItem, { flexDirection: 'row' }]}>
                <Input
                  autoCapitalize='none'
                  style={[styles.inputRegister, styles.input]}
                  placeholder='E.g. Tractor'
                />
                <Button
                  block
                  style={[
                    styles.loginButton,
                    {
                      width: null,
                      paddingHorizontal: 10,
                      marginTop: 0,
                      marginBottom: 10
                    }
                  ]}
                >
                  <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
                    Search
                  </Text>
                </Button>
              </Item>
            </CardItem>
          </Card>
          <ScrollView contentContainerStyle={styles.container}>
            {
              //   Object.keys(this.state.adObject).map(item => {
              //   return <Text key={item}>{Object.values(item)}</Text>;
              // })
            }
            <FlatList />
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}
