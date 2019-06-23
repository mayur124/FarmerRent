import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Item, Card, CardItem, Form, Input, Label, Button } from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as firebase from 'firebase';

export default class FarmerProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: true,
      editBtnText: 'Edit Profile',
      password: '',
      uploadingFlag: false
    };
  }

  componentDidMount() {
    let user = firebase.auth().currentUser.email;
    let userForFirebase = user.replace(new RegExp('\\.', 'g'), '_');
    console.log(userForFirebase);
    let displayName = firebase.auth().currentUser.displayName.split(' ');
    let fname = displayName[0].trim();
    let lname = displayName[1].trim();
    let username = user.split('@')[0];
    this.setState({ username: username });
    // console.log(fname, ' ', lname);
    this.setState({ fname: fname, lname: lname });
    let dbRef = firebase.database().ref('users/farmers/' + userForFirebase);
    dbRef.once('value', async snapshot => {
      let key = Object.keys(snapshot.val());
      // console.log(snapshot.val()[key[0]].phone);
      await this.setState({
        phone: snapshot.val()[key[0]].phone,
        address: snapshot.val()[key[0]].address,
        city: snapshot.val()[key[0]].city,
        state: snapshot.val()[key[0]].state,
        pinCode: snapshot.val()[key[0]].pinCode,
        userType: snapshot.val()[key[0]].userType,
        key: key[0]
      });
    });
  }

  static navigationOptions = {
    title: 'Profile',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    },
    headerRight: (
      <Button
        transparent
        full
        style={{ marginRight: 15 }}
        onPress={() => firebase.auth().signOut()}
      >
        <Text
          style={{
            color: '#D9AE3C',
            textAlign: 'center',
            fontSize: 16
          }}
        >
          Sign out
        </Text>
      </Button>
    )
  };

  updateProfile = async () => {
    this.setState({
      editFlag: this.state.editFlag === true ? false : true,
      editBtnText:
        this.state.editBtnText === 'Edit Profile' ? 'Done' : 'Edit Profile'
    });
    if (this.state.editBtnText === 'Done') {
      this.setState({ uploadingFlag: true });
      let {
        editFlag,
        editBtnText,
        password,
        uploadingFlag,
        fname,
        lname,
        key,
        username,
        ...uData
      } = this.state;

      let userEmail = firebase.auth().currentUser.email;
      let userForFirebase = userEmail.replace(new RegExp('\\.', 'g'), '_');

      let dbRef = firebase
        .database()
        .ref('users/vendors/' + userForFirebase + '/' + this.state.key);
      dbRef
        .set(uData, error => {
          if (!error) {
            Alert.alert('Profile updated successfully');
          }
        })
        .then(this.setState({ uploadingFlag: false }))
        .catch(error => console.log(error));

      let user = firebase.auth().currentUser;
      user
        .updateProfile({
          displayName: fname + ' ' + lname
        })
        .then(() => console.log('displayName updated'))
        .catch(error => Alert.alert(error));
      if (password !== '') {
        user
          .updatePassword(password)
          .then(() => console.log('password reset done'))
          .catch(error => Alert.alert(error));
      }
    }
  };

  render() {
    if (this.state.uploadingFlag) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
          <Text>Updating Profile</Text>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <CardItem header bordered>
          <Button
            block
            style={{
              alignSelf: 'center',
              width: '100%',
              backgroundColor: '#453421'
            }}
            onPress={() => this.updateProfile()}
          >
            <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
              {this.state.editBtnText}
            </Text>
          </Button>
        </CardItem>
        <KeyboardAwareScrollView>
          <View>
            <Card style={styles.cardContainer}>
              <Form>
                <CardItem style={{ flexDirection: 'row', marginBottom: -10 }}>
                  <Item stackedLabel style={[{ flex: 1 }, styles.formItem]}>
                    <Label>First name</Label>
                    <Input
                      style={[styles.input, { justifyContent: 'flex-start' }]}
                      autoCorrect={false}
                      autoCapitalize='none'
                      keyboardType='name-phone-pad'
                      onChangeText={fname => this.setState({ fname })}
                      disabled={this.state.editFlag}
                      value={this.state.fname}
                    />
                  </Item>
                  <Item stackedLabel style={[{ flex: 1 }, styles.formItem]}>
                    <Label>Last name</Label>
                    <Input
                      style={[styles.input, { justifyContent: 'flex-end' }]}
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='name-phone-pad'
                      onChangeText={lname => this.setState({ lname })}
                      disabled={this.state.editFlag}
                      value={this.state.lname}
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
                    disabled={this.state.editFlag}
                    value={this.state.username}
                  />
                </Item>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>Change password</Label>
                  <Input
                    style={[styles.inputRegister, styles.input]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={password => this.setState({ password })}
                    disabled={this.state.editFlag}
                    placeholder='**********'
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
                    disabled={this.state.editFlag}
                    value={this.state.phone}
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
                    disabled={this.state.editFlag}
                    value={this.state.address}
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
                    disabled={this.state.editFlag}
                    value={this.state.city}
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
                    disabled={this.state.editFlag}
                    value={this.state.state}
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
                    disabled={this.state.editFlag}
                    value={this.state.pinCode}
                  />
                </Item>
              </Form>
            </Card>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}
