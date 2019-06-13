import React from 'react';
import { View, Text, SafeAreaView, Dimensions } from 'react-native';
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
import { styles, vendorStyles } from '../../components/Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as firebase from 'firebase';

export default class VendorProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: true,
      editBtnText: 'Edit Profile'
    };
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
    await this.setState({
      editFlag: this.state.editFlag === true ? false : true,
      editBtnText:
        this.state.editBtnText === 'Edit Profile' ? 'Done' : 'Edit Profile'
    });
    if (this.state.editBtnText === 'Done') {
    }
  };

  render() {
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
                    />
                  </Item>
                </CardItem>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>Phone number</Label>
                  <Input
                    style={[styles.inputRegister, styles.input]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='number-pad'
                    onChangeText={phone => this.setState({ phone })}
                    disabled={this.state.editFlag}
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
