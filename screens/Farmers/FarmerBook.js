import React from 'react';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { Item, Card, CardItem, Form, Input, Label, Button } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as firebase from 'firebase';
import { vendorStyles, styles } from '../../components/Styles';

export default class FarmerBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceNumber: '',
      price: '',
      fromDate: '',
      toDate: '',
      cost: 0,
      bookingDate: '',
      pricingType: '',
      hoursUsed: 0,
      isFromDateTimePickerVisible: false,
      isToDateTimePickerVisible: false,
      costVisible: 'none',
      buttonText: 'Book',
      dayDifference: 1,
      uploading: false
    };
  }

  static navigationOptions = {
    title: 'Book',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#A18F78',
      textAlign: 'center'
    }
  };

  async componentDidMount() {
    const adObject = await this.props.navigation.getParam('adObject');
    await this.setState({
      price:
        adObject.pricingType === 'Per Hour Pricing'
          ? adObject.price + ' / hour'
          : adObject.price + ' / day',
      priceNumber: adObject.price,
      pricingType: adObject.pricingType,
      bookingDate: new Date().toDateString()
    });
  }

  validateData = () => {
    if (
      this.state.fromDate !== '' &&
      this.state.toDate !== '' &&
      this.state.hoursUsed !== 0
    ) {
      if (this.state.hoursUsed > 10 || this.state.hoursUsed <= 0) {
        Alert.alert('Max limit of using machine is 10 hours');
        return;
      }
      const adObject = this.props.navigation.getParam('adObject');
      // console.log(this.state.fromDate, '\t', this.state.toDate);
      let tempDifference =
        Math.abs(new Date(this.state.toDate).getTime()) -
        Math.abs(new Date(this.state.fromDate).getTime());
      let difference = Math.ceil(tempDifference / (1000 * 3600 * 24));
      difference = difference === 0 ? 1 : difference + 1;
      this.setState({
        buttonText: 'Confirm Booking',
        cost:
          this.state.pricingType === 'Per Hour Pricing'
            ? adObject.price * this.state.hoursUsed * difference
            : adObject.price * difference,
        costVisible: 'flex'
      });
      if (this.state.buttonText === 'Confirm Booking') {
        Alert.alert(
          'Confirm Booking?',
          null,
          [
            {
              text: 'Yes',
              onPress: () => {
                this.setState({ uploading: true });
                let currentFarmer = firebase.auth().currentUser.email;
                currentFarmer = currentFarmer.replace(
                  new RegExp('\\.', 'g'),
                  '_'
                );
                const dbRef = firebase
                  .database()
                  .ref('farmerBookings/' + currentFarmer);
                let bookingObject = {
                  adKey: adObject.key,
                  vendorEmail: adObject.vendorEmail,
                  fromDate: this.state.fromDate,
                  toDate: this.state.toDate,
                  cost: this.state.cost,
                  hoursUsed: this.state.hoursUsed,
                  bookingDate: this.state.bookingDate,
                  machineType: adObject.machineType
                };
                dbRef
                  .push(bookingObject, error => {
                    if (!error) {
                      Alert.alert('Ad booked successfully');
                      this.setState({ uploading: false });
                      this.props.navigation.replace('Home');
                    }
                  })
                  .catch(error => console.error(error));
              }
            },
            { text: 'No' }
          ],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert('Please provide all the details');
      return;
    }
  };

  render() {
    if (this.state.uploading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return (
      <KeyboardAwareScrollView contentContainerStyle={vendorStyles.container}>
        <DateTimePicker
          minimumDate={new Date()}
          isVisible={this.state.isFromDateTimePickerVisible}
          onConfirm={fromDate =>
            this.setState({
              fromDate: fromDate.toDateString(),
              isFromDateTimePickerVisible: false
            })
          }
          onCancel={() => {
            this.setState({ isFromDateTimePickerVisible: false });
          }}
        />

        <DateTimePicker
          minimumDate={
            this.state.fromDate === ''
              ? new Date()
              : new Date(this.state.fromDate)
          }
          isVisible={this.state.isToDateTimePickerVisible}
          onConfirm={toDate =>
            this.setState({
              toDate: toDate.toDateString(),
              isToDateTimePickerVisible: false
            })
          }
          onCancel={() => {
            this.setState({ isToDateTimePickerVisible: false });
          }}
        />

        <Card
          style={{
            width: Dimensions.get('screen').width - 10,
            paddingBottom: 20
          }}
        >
          <CardItem header bordered>
            <Text style={[styles.heading, { color: '#000' }]}>
              Choose Dates
            </Text>
          </CardItem>
          <Form style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({ isFromDateTimePickerVisible: true })
              }
              style={{
                backgroundColor: '#BFBFBF',
                width: Dimensions.get('screen').width - 40,
                padding: 10,
                borderRadius: 5,
                margin: 10
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                Select Start Date
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                display: this.state.fromDate === '' ? 'none' : 'flex'
              }}
            >
              Start Date: {new Date(this.state.fromDate).toDateString()}
            </Text>

            <TouchableOpacity
              onPress={() => this.setState({ isToDateTimePickerVisible: true })}
              style={{
                backgroundColor: '#BFBFBF',
                width: Dimensions.get('screen').width - 40,
                padding: 10,
                borderRadius: 5,
                margin: 10
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                Select End Date
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                display: this.state.toDate === '' ? 'none' : 'flex'
              }}
            >
              End Date: {new Date(this.state.toDate).toDateString()}
            </Text>

            <Item stackedLabel>
              <Label>*How many hours will you use machine? (Max. 10 hrs)</Label>
              <Input
                keyboardType='decimal-pad'
                onChangeText={hoursUsed => this.setState({ hoursUsed })}
              />
            </Item>

            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                display: this.state.costVisible,
                marginTop: 10
              }}
            >
              Cost: &#8377;{this.state.cost}
            </Text>
          </Form>
        </Card>

        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'space-around',
            bottom: 0,
            flexDirection: 'row',
            backgroundColor: '#D2B48C',
            width: Dimensions.get('screen').width,
            zIndex: 1
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            &#8377; {this.state.price}
          </Text>
          <Button
            onPress={() => this.validateData()}
            style={{
              paddingHorizontal: 10,
              borderRadius: 10,
              backgroundColor: '#453421',
              margin: 5,
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                color: '#D9AE3C'
              }}
            >
              {this.state.buttonText}
            </Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
