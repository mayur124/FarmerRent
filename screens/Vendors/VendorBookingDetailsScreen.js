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
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';

export default class VendorBookingDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adObject: {},
      loading: false,
      farmerDetails: {},
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
    await this.setState({ loading: true });
    const adData = this.props.navigation.getParam('adData');
    const farmerDetailsDbRef = firebase
      .database()
      .ref('users/farmers/' + adData.farmerId);
    await farmerDetailsDbRef.once('value', snapshot =>
      this.setState({
        farmerDetails: Object.values(snapshot.val()),
        adObject: adData
      })
    );
    console.log(this.state.adObject);
    console.log(this.state.farmerDetails);
    await this.setState({ loading: true });
  }

  showContactOptions = flag => {
    this.setState({ modalVisible: flag });
  };

  whatsappAction = phone => {
    let whatsappUrl = `whatsapp://send?text=Hello, I am ${
      firebase.auth().currentUser.displayName
    }. This is regarding machine ${
      this.state.adObject.machineType
    } which you have booked in FarmerRent&phone=91${phone}`;

    Linking.openURL(whatsappUrl);
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
      Object.keys(this.state.farmerDetails).length > 0
    ) {
      return (
        <ScrollView contentContainerStyle={vendorStyles.container}>
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
                      this.callAction(this.state.farmerDetails[0].phone)
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
                      this.smsAction(this.state.farmerDetails[0].phone)
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
                      this.whatsappAction(this.state.farmerDetails[0].phone)
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

          <Text
            style={{ marginVertical: 10, fontSize: 25, fontWeight: 'bold' }}
          >
            {this.state.adObject.machineType}
          </Text>

          <Card style={{ width: Dimensions.get('screen').width - 20 }}>
            <CardItem>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Farmer Details
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
                  {this.state.farmerDetails[0].fname +
                    ' ' +
                    this.state.farmerDetails[0].lname}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: '700' }}>Phone: </Text>
                <TouchableOpacity onPress={() => this.showContactOptions(true)}>
                  <Text style={{ color: '#2475B0' }}>
                    {this.state.farmerDetails[0].phone}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: '700' }}>Address: </Text>
                <Text>{this.state.farmerDetails[0].address}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: '700' }}>City / Village: </Text>
                <Text>{this.state.farmerDetails[0].city}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: '700' }}>State: </Text>
                <Text>{this.state.farmerDetails[0].state}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: '700' }}>Pincode: </Text>
                <Text>{this.state.farmerDetails[0].pinCode}</Text>
              </View>
            </CardItem>
          </Card>

          <Card style={{ width: Dimensions.get('screen').width - 20 }}>
            <CardItem>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Booking Details
              </Text>
            </CardItem>
            <CardItem
              style={{
                flexWrap: 'wrap',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: 'bold' }}>Cost:</Text>
                <Text>&#8377;{this.state.adObject.cost}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold' }}>Booking Date:</Text>
                <Text>{this.state.adObject.bookingDate}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: 'bold' }}>From:</Text>
                <Text>{this.state.adObject.fromDate}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: 'bold' }}>To:</Text>
                <Text>{this.state.adObject.toDate}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: 'bold' }}>Machine Use Hours:</Text>
                <Text>{this.state.adObject.hoursUsed}</Text>
              </View>
            </CardItem>
          </Card>
        </ScrollView>
      );
    }
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' />
      </View>
    );
  }
}
