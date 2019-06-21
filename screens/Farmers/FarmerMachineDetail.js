import React from 'react';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Linking,
  Platform,
  Alert
} from 'react-native';
import { Button, Card, CardItem } from 'native-base';
import * as firebase from 'firebase';
import { vendorStyles, styles } from '../../components/Styles';
export default class FarmerMachineDetail extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      adObject: {},
      vendorProfile: {},
      price: '',
      modalVisible: false
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
    this._isMounted = true;
    this.forceUpdate();
    await this.setState({ adObject: this.props.navigation.getParam('item') });
    await console.log('this.state.adObject\n', this.state.adObject);
    if (this.state.adObject.pricingType === 'Per Hour Pricing') {
      await this.setState({ price: this.state.adObject.price + ' / hour' });
    } else {
      await this.setState({ price: this.state.adObject.price + ' / day' });
    }
    if (this._isMounted) {
      const dbRef = firebase
        .database()
        .ref('users/vendors/' + this.state.adObject.vendorEmail);
      dbRef
        .once('value', async snapshot => {
          await console.log('Snapshot: \n', snapshot.val());
        })
        .then(result =>
          this.setState({ vendorProfile: Object.values(result.val()) })
        )
        .catch(error => console.log(error));
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  showImages = () => {
    let temp_image = [];
    this.state.adObject.imagePaths.map((item, index) => {
      temp_image.push(
        <View key={index} style={{ height: 180, width: 180 }}>
          <Image
            key={index}
            source={{ uri: item }}
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: 'silver',
              padding: 5,
              borderRadius: 5,
              height: null,
              width: null,
              margin: 3,
              resizeMode: 'cover'
            }}
          />
        </View>
      );
    });
    // console.log('state imagePaths: ', this.state.imagePaths);

    return temp_image;
  };

  showContactOptions = flag => {
    this.setState({ modalVisible: flag });
  };

  whatsappAction = phone => {
    let whatsappUrl = `whatsapp://send?text=Hello, I am ${
      firebase.auth().currentUser.displayName
    }. This is regarding machine ${
      this.state.adObject.machineType
    } which you have posted in FarmerRent&phone=91${phone}`;

    Linking.openURL(whatsappUrl);

    // console.log(whatsappUrl);
    // Linking.canOpenURL(whatsappUrl)
    //   .then(supported => {
    //     console.log(supported);
    //     if (supported) {
    //       return Linking.openURL(whatsappUrl);
    //     } else {
    //       Alert.alert('WhatsApp is not installed');
    //     }
    //   })
    //   .catch(error => console.log(error));
  };

  smsAction = phone => {
    let phoneNumber = phone;
    phoneNumber = `sms:${phone}`;

    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(error => console.log(error));
  };

  callAction = phone => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    } else {
      phoneNumber = `tel:${phone}`;
    }

    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(error => console.log(error));
  };

  render() {
    if (
      Object.keys(this.state.adObject).length > 0 &&
      this.state.price !== '' &&
      Object.keys(this.state.vendorProfile).length > 0
    ) {
      return (
        <View style={vendorStyles.container}>
          <Modal
            animationType='fade'
            transparent={true}
            visible={this.state.modalVisible}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center'
              }}
            >
              <Card
                style={{
                  padding: 10,
                  width: Dimensions.get('screen').width - 10,
                  borderRadius: 10,
                  alignSelf: 'center'
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.showContactOptions(!this.state.modalVisible)
                  }
                >
                  <Text
                    style={{
                      right: 0,
                      fontSize: 20,
                      fontWeight: 'bold'
                    }}
                  >
                    X
                  </Text>
                </TouchableOpacity>
                <CardItem
                  style={{
                    justifyContent: 'space-around'
                  }}
                >
                  <TouchableOpacity
                    style={{ flexDirection: 'column' }}
                    onPress={() =>
                      this.callAction(this.state.vendorProfile[0].phone)
                    }
                  >
                    <Image
                      source={require('../../assets/call-answer.png')}
                      style={{ height: 50, width: 50 }}
                    />
                    <Text>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: 'column' }}
                    onPress={() =>
                      this.smsAction(this.state.vendorProfile[0].phone)
                    }
                  >
                    <Image
                      source={require('../../assets/speech-bubble.png')}
                      style={{ height: 50, width: 50 }}
                    />
                    <Text>SMS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: 'column' }}
                    onPress={() =>
                      this.whatsappAction(this.state.vendorProfile[0].phone)
                    }
                  >
                    <Image
                      source={require('../../assets/whatsapp.png')}
                      style={{ height: 50, width: 50 }}
                    />
                    <Text>WhatsApp</Text>
                  </TouchableOpacity>
                </CardItem>
              </Card>
            </View>
          </Modal>

          <ScrollView
            style={{ marginBottom: 60 }}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              style={{ marginVertical: 10, fontSize: 25, fontWeight: 'bold' }}
            >
              {this.state.adObject.machineType}
            </Text>

            <ScrollView
              horizontal={true}
              style={{ flex: 1, flexDirection: 'row' }}
            >
              {this.showImages()}
            </ScrollView>

            <Card style={{ width: Dimensions.get('screen').width - 20 }}>
              <CardItem>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Vendor Details
                </Text>
              </CardItem>
              <CardItem
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700' }}>Name: </Text>
                  <Text>
                    {this.state.vendorProfile[0].fname +
                      ' ' +
                      this.state.vendorProfile[0].lname}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700' }}>Phone: </Text>
                  <TouchableOpacity
                    onPress={() => this.showContactOptions(true)}
                  >
                    <Text style={{ color: '#2475B0' }}>
                      {this.state.vendorProfile[0].phone}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text style={{ fontWeight: '700' }}>Address: </Text>
                  <Text>{this.state.vendorProfile[0].address}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700' }}>City / Village: </Text>
                  <Text>{this.state.vendorProfile[0].city}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700' }}>State: </Text>
                  <Text>{this.state.vendorProfile[0].state}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700' }}>Pincode: </Text>
                  <Text>{this.state.vendorProfile[0].pinCode}</Text>
                </View>
              </CardItem>
              <TouchableOpacity
                style={{ paddingBottom: 10 }}
                onPress={() =>
                  this.props.navigation.navigate('F_VendorAllMachines', {
                    vendor: this.state.adObject.vendorEmail
                  })
                }
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: '#2475B0',
                    textAlign: 'center'
                  }}
                >
                  See all machines from this vendor &#x2192;
                </Text>
              </TouchableOpacity>
            </Card>

            <Card style={{ width: Dimensions.get('screen').width - 20 }}>
              <CardItem>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Description
                </Text>
              </CardItem>
              <CardItem style={{ flexWrap: 'wrap' }}>
                <Text>{this.state.adObject.description}</Text>
              </CardItem>
            </Card>

            <Card style={{ width: Dimensions.get('screen').width - 20 }}>
              <CardItem>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Specification
                </Text>
              </CardItem>
              <CardItem
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700' }}>Manufacturer: </Text>
                  <Text>{this.state.adObject.manufacturer}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700' }}>Model: </Text>
                  <Text>{this.state.adObject.model}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700' }}>
                    Year of manufacturing:{' '}
                  </Text>
                  <Text>{this.state.adObject.yearOfManufacturing}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700' }}>Horsepower: </Text>
                  <Text>{this.state.adObject.horsePower} hp</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700' }}>Condition: </Text>
                  <Text>{this.state.adObject.condition}</Text>
                </View>
              </CardItem>
            </Card>

            {this.state.adObject.policy === '' ? (
              <View style={{ height: 0, width: 0 }} />
            ) : (
              <Card style={{ width: Dimensions.get('screen').width - 20 }}>
                <CardItem>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                    Policy
                  </Text>
                </CardItem>
                <CardItem style={{ flexWrap: 'wrap' }}>
                  <Text>{this.state.adObject.policy}</Text>
                </CardItem>
              </Card>
            )}
          </ScrollView>
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'space-around',
              bottom: 0,
              flexDirection: 'row',
              backgroundColor: '#D2B48C',
              width: Dimensions.get('screen').width
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              &#8377; {this.state.price}
            </Text>
            <Button
              style={{
                paddingHorizontal: 10,
                borderRadius: 10,
                backgroundColor: '#453421',
                margin: 5,
                alignItems: 'center'
              }}
              onPress={() =>
                this.props.navigation.navigate('FarmerBook', {
                  adObject: this.state.adObject
                })
              }
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: '#D9AE3C'
                }}
              >
                Book
              </Text>
            </Button>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' />
      </View>
    );
  }
}
