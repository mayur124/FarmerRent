import React from 'react';
import { Text, View, ScrollView, Alert } from 'react-native';
import {
  Item,
  Card,
  CardItem,
  Form,
  Input,
  Label,
  Button,
  Picker
} from 'native-base';
import { styles } from '../components/Styles';
import * as firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      username: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pinCode: '',
      userType: '',
      validationFlag: '',
      i: 0
    };
  }

  onValueChange(value) {
    this.setState({ userType: value });
  }

  static navigationOptions = {
    title: 'SignUp',
    header: null
  };

  createUser = () => {
    this.setState({ i: this.state.i + 1 });

    let { username, password, fname, lname, phone, userType } = this.state;
    username = username.trim().concat('@farmerRent.com');

    console.log(`Count: ${this.state.i}`, this.validateFields());

    if (this.validateFields() !== false) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(username, password)
        .then(async authenticate => {
          const dbReference = firebase.database();
          var user = {
            username: username,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            pinCode: this.state.pinCode,
            userType: this.state.userType,
            phone: this.state.phone
          };
          switch (userType) {
            case 'farmer':
              await dbReference.ref('users/farmers/').push(user, error => {
                if (error) Alert.alert(error.message, '');
              });
              break;
            case 'vendor':
              await dbReference.ref('users/vendors/').push(user, error => {
                if (error) Alert.alert(error.message, '');
              });
              break;
          }
          return authenticate.user
            .updateProfile({
              displayName: fname + ' ' + lname,
              phoneNumber: phone
            })
            .then(() => {
              this.props.navigation.navigate('SignIn');
            })
            .catch(error => console.log(error));
        })
        .catch(error => {
          if (this.state.username === '') console.log(error.code, error);
          else Alert.alert(error.message, '');
        });
    }
  };

  validateFields = () => {
    //#region checking if all fields are filled or not

    // for(let value of Object.values(this.state)){
    //   if(!value.length){
    //     Alert.alert("All fields are required","")
    //     flag = true
    //     break
    //   }
    // }

    //#endregion
    if (
      this.state.fname !== '' &&
      this.state.lname !== '' &&
      this.state.username !== '' &&
      this.state.password !== '' &&
      this.state.confirmPassword !== '' &&
      this.state.phone !== '' &&
      this.state.address !== '' &&
      this.state.city !== '' &&
      this.state.state !== '' &&
      this.state.pinCode !== '' &&
      this.state.userType !== ''
    ) {
      //#region validating fname and lname
      // fname and lname should not contain any number,special characters

      const regexForFname = RegExp('^[a-zA-Z]{3,}$', 'g');
      const regexForLname = RegExp('^[a-zA-Z]{3,}$', 'g');
      const { fname, lname } = this.state;

      fname.trim();
      lname.trim();

      let fnameResult = regexForFname.test(fname);
      let lnameResult = regexForLname.test(lname);

      if (fnameResult === false) {
        Alert.alert('Firstname is not valid.', '');
        // this.setState({validationFlag: false})
        return false;
      } else {
        // this.setState({validationFlag: true})
      }

      if (lnameResult === false) {
        Alert.alert('Lastname is not valid.', '');
        // this.setState({validationFlag: false})
        return false;
      } else {
        // this.setState({validationFlag: true})
      }

      //#endregion

      //#region validating password and confirm password

      const { password, confirmPassword } = this.state;
      if (password !== confirmPassword) {
        Alert.alert('Password and Confirm password should match', '');
        // this.setState({validationFlag: false})
        return false;
      } else {
        // this.setState({validationFlag: true})
      }

      //#endregion

      //#region validating phone number

      const phoneRegex = RegExp('^\\d{10}$', 'g');
      const { phone } = this.state;

      if (phoneRegex.test(phone) === false) {
        Alert.alert('Invalid phone number', '');
        // this.setState({validationFlag: false})
        return false;
      } else {
        // this.setState({validationFlag: true})
      }

      //#endregion

      //#region validating city and state

      const regexForCity = RegExp('^[a-zA-Z]{3,}$', 'g');
      const regexForState = RegExp('^[a-zA-Z]{3,}$', 'g');
      const { city, state } = this.state;
      let cityResult = regexForCity.test(city);
      let stateResult = regexForState.test(state);

      if (cityResult === false) {
        Alert.alert('City is not valid', '');
        // this.setState({validationFlag: false})
        return false;
      } else {
        // this.setState({validationFlag: true})
      }

      if (stateResult === false) {
        Alert.alert('State is not valid', '');
        // this.setState({validationFlag: false})
        return false;
      } else {
        // this.setState({validationFlag: true})
      }

      //#endregion

      //#region validating pincode

      const pinRegex = RegExp('^\\d{6}$', 'g');
      const { pinCode } = this.state;

      if (pinRegex.test(pinCode) === false) {
        Alert.alert('Pincode is invalid', '');
        // this.setState({validationFlag: false})
        return false;
      } else {
        // this.setState({validationFlag: true})
      }

      //#endregion

      return true;
    } //main if completed
    else {
      Alert.alert('Please fill all the fields', '');
      // this.setState({validationFlag: false})
      return false;
    }
    //#region Checking if username is already present or not - not needed now

    // let dbReference = firebase.database();
    // let {userType} = this.state;
    // switch(userType){
    //   case "farmer":
    //     dbReference.ref('users/farmers/')
    //     .once('value')
    //     .then(snapshot => {
    //       if(snapshot){
    //         let data = snapshot.val()
    //         let key = Object.keys(data)
    //         console.log(key);
    //         key.map(x => {
    //           console.log(data[x].username)
    //           if(this.state.username=== data[x].username)
    //             Alert.alert("This username is already taken please use different username")
    //             return;
    //         })
    //       }
    //       else
    //         console.log("No data found");
    //     })
    //     .catch(error => {console.log(`Error in farmer: ${error}`)})

    //     break;
    //   case "vendor":
    //     dbReference.ref('users/vendors')
    //     .once('value')
    //     .then(snapshot => {
    //       if(snapshot)
    //         console.log(snapshot);
    //       else
    //         console.log("No data found");
    //     })
    //     .catch(error => {console.log(`Error in vendor: ${error}`)})

    //    break;
    // }

    //#endregion
  };

  render() {
    return (
      <ScrollView contentContainerStyle={[styles.container, { marginTop: 40 }]}>
        <Text
          style={[
            styles.heading,
            { fontSize: 30, marginBottom: 10, textAlign: 'center' }
          ]}
        >
          Welcome
        </Text>
        <KeyboardAwareScrollView>
          <View>
            <Card style={styles.cardContainer}>
              <CardItem header bordered style={{ backgroundColor: '#453421' }}>
                <Text style={styles.heading}>Register</Text>
              </CardItem>
              <Form>
                <CardItem style={{ flexDirection: 'row', marginBottom: -10 }}>
                  <Item stackedLabel style={[{ flex: 1 }, styles.formItem]}>
                    <Label>First name</Label>
                    <Input
                      style={[styles.input, { justifyContent: 'flex-start' }]}
                      autoCorrect={false}
                      autoCapitalize='none'
                      keyboardType='name-phone-pad'
                      onChangeText={fname => {
                        this.setState({ fname });
                      }}
                      autoFocus
                    />
                  </Item>
                  <Item stackedLabel style={[{ flex: 1 }, styles.formItem]}>
                    <Label>Last name</Label>
                    <Input
                      style={[styles.input, { justifyContent: 'flex-end' }]}
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='name-phone-pad'
                      onChangeText={lname => {
                        this.setState({ lname });
                      }}
                    />
                  </Item>
                </CardItem>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>Username</Label>
                  <Input
                    style={[styles.inputRegister, styles.input]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={username => this.setState({ username })}
                  />
                </Item>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>Password</Label>
                  <Input
                    secureTextEntry={true}
                    style={[styles.inputRegister, styles.input]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={password => this.setState({ password })}
                  />
                </Item>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>Confirm Password</Label>
                  <Input
                    secureTextEntry={true}
                    style={[styles.inputRegister, styles.input]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={confirmPassword =>
                      this.setState({ confirmPassword })
                    }
                  />
                </Item>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>Phone number</Label>
                  <Input
                    style={[styles.inputRegister, styles.input]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='number-pad'
                    onChangeText={phone => this.setState({ phone })}
                  />
                </Item>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>Address</Label>
                  <Input
                    style={[styles.inputRegister, styles.input]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='name-phone-pad'
                    onChangeText={address => this.setState({ address })}
                  />
                </Item>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>City/Village</Label>
                  <Input
                    style={[styles.inputRegister, styles.input]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='name-phone-pad'
                    onChangeText={city => this.setState({ city })}
                  />
                </Item>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>State</Label>
                  <Input
                    style={[styles.inputRegister, styles.input]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='name-phone-pad'
                    onChangeText={state => this.setState({ state })}
                  />
                </Item>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>Pincode</Label>
                  <Input
                    style={[styles.inputRegister, styles.input]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='number-pad'
                    onChangeText={pinCode => this.setState({ pinCode })}
                  />
                </Item>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>
                    I am farmer/vendor &#x25bc;
                  </Label>
                  <Picker
                    style={styles.picker}
                    mode='dropdown'
                    fontSize='18'
                    placeholderStyle={{
                      color: '#4d4d51',
                      justifyContent: 'flex-start',
                      fontSize: 18
                    }}
                    selectedValue={this.state.userType}
                    onValueChange={this.onValueChange.bind(this)}
                  >
                    <Picker.Item label='I am Farmer' value='farmer' />
                    <Picker.Item label='I am Vendor' value='vendor' />
                  </Picker>
                </Item>
                <Button
                  block
                  style={styles.loginButton}
                  onPress={() => {
                    this.createUser();
                  }}
                >
                  <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
                    Sign Up
                  </Text>
                </Button>
              </Form>
            </Card>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    );
  }
}
