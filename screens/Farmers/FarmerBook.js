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
import * as firebase from 'firebase';
import { vendorStyles, styles } from '../../components/Styles';

export default class FarmerBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: '',
      fromDate: '',
      toDate: '',
      cost: 0,
      bookingDate: '',
      pricingType: '',
      hoursUsed: '',
      isFromDateTimePickerVisible: false,
      isToDateTimePickerVisible: false
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
      pricingType: adObject.pricingType
    });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={vendorStyles.container}>
        <DateTimePicker
          isVisible={this.state.isFromDateTimePickerVisible}
          onConfirm={fromDate => this.setState({ fromDate })}
          onCancel={() => {
            this.setState({ isFromDateTimePickerVisible: false });
          }}
        />

        <DateTimePicker
          isVisible={this.state.isToDateTimePickerVisible}
          onConfirm={toDate => this.setState({ toDate })}
          onCancel={() => {
            this.setState({ isToDateTimePickerVisible: false });
          }}
        />

        <Card style={{ width: Dimensions.get('screen').width - 10 }}>
          <CardItem header bordered style={{ backgroundColor: '#BFBFBF' }}>
            <Text style={[styles.heading, { color: '#000' }]}>
              Choose Dates
            </Text>
          </CardItem>
          <Form style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({ isFromDateTimePickerVisible: true })
              }
            >
              <Text
                style={{
                  color: '#2475B0',
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
              Start Date: {this.state.fromDate}
            </Text>

            <TouchableOpacity
              onPress={() => this.setState({ isToDateTimePickerVisible: true })}
            >
              <Text
                style={{
                  color: '#2475B0',
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
              End Date: {this.state.toDate}
            </Text>

            <Item stackedLabel style={[styles.formItem]}>
              <Label style={styles.formLabels}>
                How many hours will you use machine? (Max. 10 hrs)
              </Label>
              <Input
                style={[styles.inputRegister, styles.input]}
                value={this.state.toDate}
                onChangeText={hoursUsed => this.setState({ hoursUsed })}
              />
            </Item>
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
            &#8377; {this.state.cost === 0 ? this.state.price : this.state.cost}
          </Text>
          <Button
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
              Book
            </Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}
