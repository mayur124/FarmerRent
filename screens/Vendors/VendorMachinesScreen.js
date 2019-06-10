import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList
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

          // console.log(this.state.adsArray);
        } else {
          await this.setState({
            hasPostedAnyAd: false
          });
          console.log('No ads present');
        }
      });
    }
    this.forceUpdate();
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
            style={[styles.input, { alignContent: 'center' }]}
            placeholder='Search - E.g. Tractor'
          />
        </Item>
        <FlatList
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
          data={this.state.adsArray}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('MachineDetail', {
                    item: item
                  });
                }}
              >
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
                    <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          flexWrap: 'wrap'
                        }}
                      >
                        {item.machineType}
                      </Text>
                      <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                        Pricing type:
                      </Text>
                      <Text>{item.pricingType}</Text>
                      <Text style={{ fontWeight: 'bold' }}>Price:</Text>
                      <Text>&#8377;{item.price}</Text>
                    </View>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.key.toString()}
        />
      </View>
    );
  }
}
