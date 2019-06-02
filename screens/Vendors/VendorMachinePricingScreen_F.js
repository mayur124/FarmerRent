import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  Switch,
  ActivityIndicator
} from 'react-native';
import {
  Item,
  Card,
  CardItem,
  Form,
  Input,
  Label,
  Button,
  Picker,
  Textarea
} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles, vendorStyles } from '../../components/Styles';
export default class VendorMachinePricingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pricingType: '',
      price: '',
      policy: '',
      securityDeposit: false,
      isUploading: false
    };
  }

  static navigationOptions = {
    title: 'Pricing',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    }
  };

  validateData = () => {};

  toggleDeposit = () => {
    this.setState({
      securityDeposit: this.state.securityDeposit === false ? true : false
    });
  };

  render() {
    if (this.state.isUploading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
          <Text>Your machine ad is being uploaded</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <SafeAreaView style={vendorStyles.container}>
          <ScrollView contentContainerStyle={styles.container}>
            <KeyboardAwareScrollView>
              <Card
                style={{
                  width: Dimensions.get('screen').width - 20,
                  paddingBottom: 15
                }}
              >
                <Form style={{ justifyContent: 'center' }}>
                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>
                      Pricing method &#x25bc;
                    </Label>
                    <Picker
                      style={[vendorStyles.picker, styles.picker]}
                      mode='dropdown'
                      fontSize='18'
                      placeholderStyle={{
                        color: '#4d4d51',
                        justifyContent: 'flex-start',
                        fontSize: 18
                      }}
                      selectedValue={this.state.pricingType}
                      onValueChange={pricingType =>
                        this.setState({ pricingType })
                      }
                    >
                      <Picker.Item
                        label='Per Day Pricing'
                        value='Per Day Pricing'
                      />
                      <Picker.Item
                        label='Per Hour Pricing'
                        value='Per Hour Pricing'
                      />
                    </Picker>
                  </Item>

                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>Price &#8377;</Label>
                    <Input
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='decimal-pad'
                      style={[styles.inputRegister, styles.input]}
                      onChangeText={price => this.setState({ price })}
                    />
                  </Item>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginTop: 10
                    }}
                  >
                    <Text style={{ fontSize: 16, marginTop: 3 }}>
                      Security deposit required?
                    </Text>
                    <Switch
                      onValueChange={() => this.toggleDeposit()}
                      value={this.state.securityDeposit}
                    />
                  </View>

                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>Policy</Label>
                    <Input
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='decimal-pad'
                      style={[styles.inputRegister, styles.input]}
                      onChangeText={policy => this.setState({ policy })}
                    />
                  </Item>

                  <Text
                    style={{
                      marginTop: 5,
                      fontWeight: 'bold',
                      color: 'red',
                      marginLeft: 15
                    }}
                  >
                    Note: We will add service charge to mentioned price
                  </Text>

                  <Button
                    block
                    style={[styles.loginButton, { marginTop: 15 }]}
                    onPress={() => {
                      this.validateData();
                    }}
                  >
                    <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
                      Post
                    </Text>
                  </Button>
                </Form>
              </Card>
            </KeyboardAwareScrollView>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
