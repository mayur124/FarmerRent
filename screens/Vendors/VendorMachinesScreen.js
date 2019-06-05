import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView
} from 'react-native';
import { Card, Button, Input, Item, CardItem, Icon } from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';

export default class VendorMachineScreen extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      hasPostedAnyAd: null,
      adsArray: [],
      initialImage: '',
      visible: false
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
      let dbReference = firebase
        .database()
        .ref('vendorAds/' + currentFirebaseVendor);
      dbReference.once('value', async snapshot => {
        if (snapshot.val()) {
          let adKeys = await Object.keys(snapshot.val());
          let adValues = await Object.values(snapshot.val());
          // console.log(adKeys);
          // console.log(adValues);
          adValues.map((adData, index) => {
            adData['key'] = adKeys[index];
            // console.log('------------------------------------------');
            // console.log(adData);
            // console.log('------------------------------------------');
          });
          await this.setState({
            hasPostedAnyAd: true,
            adsArray: adValues
          });

          // console.log(this.state.adObject);
        } else {
          await this.setState({
            hasPostedAnyAd: false
          });
          console.log('No ads present');
        }
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

  toggleSearch = () => {
    this.setState({ visible: this.state.visible === false ? true : false });
  };

  render() {
    if (this.state.hasPostedAnyAd === null) {
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
      <View style={vendorStyles.container}>
        <Item
          style={[
            styles.formItem,
            {
              flexDirection: 'row',
              width: Dimensions.get('screen').width - 20,
              marginTop: 10
            }
          ]}
        >
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
            <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>Search</Text>
          </Button>
        </Item>
        <FlatList
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
          data={this.state.adsArray}
          renderItem={({ item }) => {
            return (
              <Card style={{ width: Dimensions.get('screen').width - 20 }}>
                <CardItem>
                  <Image
                    style={{
                      borderRadius: 2,
                      borderColor: '#EAF0F1',
                      backgroundColor: '#f4f4f4',
                      height: 100,
                      width: 100
                    }}
                    source={{ uri: item.imagePaths[0] }}
                  />
                  <Text>{item.machineType}</Text>
                </CardItem>
              </Card>
            );
          }}
          keyExtractor={(item, index) => item.key.toString()}
        />
      </View>
    );
  }
}
