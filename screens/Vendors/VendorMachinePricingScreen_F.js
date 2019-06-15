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
import { Item, Card, Form, Input, Label, Button, Picker } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';
import uuid from 'uuid';

export default class VendorMachinePricingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pricingType: '',
      price: '',
      policy: '',
      securityDeposit: false,
      isUploading: false,
      i: 0
    };
    this.secondScreenData = {};
    this.firstScreenData = {};
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

  validateData = () => {
    if (this.state.pricingType !== '' && this.state.price !== '') {
      this.setState({ isUploading: true });
      this.uploadMachineData();
    } else {
      Alert.alert('Please enter * marked fields');
      return;
    }
  };

  uploadMachineData = async () => {
    let tempData = Object.assign(
      {},
      this.firstScreenData,
      this.secondScreenData,
      this.state
    );
    // console.log('finalData:\n', finalData);
    // let email = firebase.auth().currentUser.email;

    const storageRef = firebase.storage().ref();
    let vEmail = firebase.auth().currentUser.email;
    let vEmailForFirebase = vEmail.replace(new RegExp('\\.', 'g'), '_');
    const dbRef = firebase.database().ref('vendorAds/' + vEmailForFirebase);

    let { tags } = tempData;
    let tagArray = tags.split(' ').filter(item => item !== '');
    let tagObject = { tags: tagArray };
    let finalData = {
      condition: tempData.condition,
      description: tempData.description,
      horsePower: tempData.horsePower,
      machineType: tempData.machineType,
      manufacturer: tempData.manufacturer,
      model: tempData.model,
      policy: tempData.policy,
      price: tempData.price,
      pricingType: tempData.pricingType,
      securityDeposit: tempData.securityDeposit,
      yearOfManufacturing: tempData.yearOfManufacturing,
      vendorEmail: vEmailForFirebase
    };

    Object.assign(finalData, tagObject);

    let { images } = tempData;
    let imagePathArray = [];
    let totalImages = images.length;
    console.log(totalImages);
    let tempImageObject = {};

    const imagesPromise = images.map(image => {
      return new Promise((resolve, reject) => {
        this.uploadImageAsync(image, storageRef, vEmail)
          .then(async url => {
            if (url) {
              await console.log('url in abc: ', url);
              await imagePathArray.push(url);
              tempImageObject = { imagePaths: imagePathArray };
              console.log('tempImageObject: \n', tempImageObject);
              return resolve('Done');
            } else {
              return reject('Not done');
            }
          })
          .catch(error => console.error(error));
      });
    });

    Promise.all(imagesPromise).then(async output => {
      await Object.assign(finalData, tempImageObject);
      await this.uploadToFirebase(dbRef, finalData);
    });
  };

  uploadToFirebase = async (dbRef, finalData) => {
    await dbRef.push(finalData, error => {
      if (!error) {
        Alert.alert('Post uploaded successfully');
        this.setState({ isUploading: false });
        this.props.navigation.replace('Equipments');
      }
    });
  };

  uploadImageAsync = async (uri, storageReference, vendorEmail) => {
    const parts = uri.split('.');
    const fileExtension = parts[parts.length - 1];

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(err) {
        console.log(err);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    //upload part
    const ref = storageReference
      .child('VendorMachines')
      .child('' + vendorEmail)
      .child(uuid.v4() + '.' + fileExtension);

    const snapshot = await ref.put(blob);

    //close blob
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  toggleDeposit = () => {
    this.setState({
      securityDeposit: this.state.securityDeposit === false ? true : false
    });
  };

  componentDidMount() {
    this.firstScreenData = this.props.navigation.getParam('firstScreenData');
    this.secondScreenData = this.props.navigation.getParam('secondScreenData');

    // console.log(
    //   'FirstScreenData: \n',
    //   this.firstScreenData,
    //   '\n\nSecondScreenData: \n',
    //   this.secondScreenData
    // );
  }

  render() {
    if (this.state.isUploading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
          <Text>Please wait...</Text>
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
                      *Pricing method &#x25bc;
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
                    <Label style={styles.formLabels}>*Price &#8377;</Label>
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
                      keyboardType='default'
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
