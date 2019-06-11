import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  Switch,
  Alert,
  Dimensions
} from 'react-native';
import {
  CardItem,
  Button,
  Form,
  Item,
  Label,
  Picker,
  Input
} from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker, Permissions } from 'expo';
import * as firebase from 'firebase';
import uuid from 'uuid';

export default class VendorMachineDetail extends React.Component {
  constructor(props) {
    super(props);
    self = this;
    this.state = {
      isLoading: true,
      editDoneText: 'Edit',
      editComponentStyle: 'none',
      editBtnStyle: 'flex',
      doneBtnStyle: 'none',
      editable: false,
      uploadingFlag: false
    };
  }

  async componentDidMount() {
    await Object.assign(this.state, this.props.navigation.getParam('item'));
    // await this.setState({ data: this.props.navigation.getParam('item') });
    await this.setState({
      isLoading: false,
      editDoneText: 'Edit',
      editComponentStyle: 'none',
      editBtnStyle: 'flex',
      doneBtnStyle: 'none',
      editable: false
    });
    // console.log(this.state.editDoneText);
  }

  static navigationOptions = {
    title: 'Details',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    }
  };

  showImages = () => {
    let temp_image = [];
    this.state.imagePaths.map((item, index) => {
      let tempKey = item + '123';
      temp_image.push(
        <View key={tempKey}>
          <View
            key={index}
            style={{
              height: 150,
              width: 150,
              borderColor: '#dddddd'
            }}
          >
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
          <Button
            key={Math.random() * Math.random()}
            transparent
            danger
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              display: this.state.editComponentStyle
            }}
            onPress={() => this.removeImage(index)}
          >
            <Text
              key={Math.random() * Math.random()}
              style={{
                color: '#CE3C3E',
                fontWeight: 'bold'
              }}
            >
              Delete
            </Text>
          </Button>
        </View>
      );
    });
    // console.log('state imagePaths: ', this.state.imagePaths);

    return temp_image;
  };

  openCamera = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    this.setState({
      hasCameraPermission: status === 'granted',
      hasGalleryPermission: status === 'granted'
    });

    if (this.state.hasCameraPermission) {
      ImagePicker.launchCameraAsync({
        aspect: [1, 1],
        quality: 0.2,
        base64: true
      })
        .then(async result => {
          if (!result.cancelled) {
            await this.setState({
              imagePaths: this.state.imagePaths.concat(result.uri)
            });
            Alert.alert(
              'Add another picture? ',
              null,
              [
                {
                  text: 'Yes',
                  onPress: () => this.openCamera()
                },
                { text: 'No' }
              ],
              { cancelable: false }
            );
          }
          // console.log(this.state.imagePaths);
        })
        .catch(error => console.log(error));
    }
  };

  removeImage = index => {
    Alert.alert('Delete this image?', null, [
      {
        text: 'Yes',
        onPress: () => {
          this.state.imagePaths.splice(index, 1);
          // console.log(this.state.imagePaths);
          this.forceUpdate();
        }
      },
      { text: 'No' }
    ]);
  };

  toggleEdit = async () => {
    this.setState({
      editComponentStyle:
        this.state.editComponentStyle === 'none' ? 'flex' : 'none',
      editDoneText: this.state.editDoneText === 'Edit' ? 'Done' : 'Edit',
      editable: this.state.editable === false ? true : false
    });
    if (this.state.editDoneText === 'Done') {
      this.setState({ uploadingFlag: true });
      let user = firebase.auth().currentUser.email;
      let username = firebase
        .auth()
        .currentUser.email.replace(new RegExp('\\.', 'g'), '_');

      const dbRef = firebase
        .database()
        .ref('vendorAds/' + username + '/' + this.state.key);

      const storageRef = firebase.storage().ref();

      let {
        key,
        isLoading,
        editDoneText,
        editComponentStyle,
        editBtnStyle,
        doneBtnStyle,
        editable,
        hasCameraPermission,
        hasGalleryPermission,
        ...uData
      } = this.state;
      // console.log('key\n',key);
      // console.log('uData\n',uData);
      const httpImages = this.state.imagePaths.filter(image =>
        image.includes('https://')
      );
      const newImages = this.state.imagePaths.filter(image =>
        image.includes('file')
      );
      const imagePromise = newImages.map(image => {
        return new Promise((resolve, reject) => {
          this.uploadImageAsync(image, storageRef, user)
            .then(async url => {
              if (url) {
                await console.log(url);
                await httpImages.push(url);
                await console.log('1) httpImages\n', httpImages);
                return resolve('Done');
              } else {
                return reject('Not done');
              }
            })
            .catch(error => console.log(error));
        });
      });

      Promise.all(imagePromise).then(async output => {
        uData.imagePaths = httpImages.slice(0);
        // console.log('uData imagePaths\n', uData.imagePaths);
        await dbRef.set(uData, async error => {
          if (!error) {
            this.setState({ uploadingFlag: false });
            this.props.navigation.replace('VendorMachines');
          }
        });
      });

      // console.log('httpImages\n', httpImages, 'newImages\n', newImages);
    }
  };

  uploadImageAsync = async (image, storageRef, user) => {
    const parts = image.split('.');
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
      xhr.open('GET', image, true);
      xhr.send(null);
    });

    const ref = storageRef
      .child('VendorMachines')
      .child('' + user)
      .child(uuid.v4() + '.' + fileExtension);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  deleteMachine = () => {
    Alert.alert('Delete this machine ?', null, [
      {
        text: 'Yes',
        onPress: async () => {
          let { key } = this.state;
          let username = firebase
            .auth()
            .currentUser.email.replace(new RegExp('\\.', 'g'), '_');
          const dbRef = firebase
            .database()
            .ref('vendorAds/' + username + '/' + key);
          await dbRef.remove(error => {
            if (!error) {
              this.props.navigation.replace('VendorMachines');
            } else {
              Alert.alert(error.message);
            }
          });
        }
      },
      {
        text: 'No'
      }
    ]);
  };

  toggleDeposit = () => {
    this.setState({
      securityDeposit: this.state.securityDeposit === false ? true : false
    });
  };

  render() {
    if (this.state.isLoading)
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
          <Text>Loading</Text>
        </View>
      );

    if (this.state.uploadingFlag)
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
          <Text>Uploading</Text>
        </View>
      );

    return (
      <View style={vendorStyles.container}>
        <CardItem>
          <Button
            full
            onPress={() => this.toggleEdit()}
            style={{ backgroundColor: '#453421', width: '90%' }}
          >
            <Text
              style={{
                color: '#D9AE3C',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              {this.state.editDoneText}
            </Text>
          </Button>
        </CardItem>
        <KeyboardAwareScrollView>
          <ScrollView
            horizontal={true}
            style={{ flex: 1, flexDirection: 'row' }}
          >
            {this.showImages()}
          </ScrollView>
          <Form
            style={{
              marginTop: 10,
              width: Dimensions.get('window').width - 10,
              paddingBottom: 20
            }}
          >
            <CardItem style={{ display: this.state.editComponentStyle }}>
              <View style={vendorStyles.machineImage}>
                <Button
                  block
                  style={styles.loginButton}
                  onPress={() => this.openCamera()}
                >
                  <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
                    Add images
                  </Text>
                </Button>
              </View>
            </CardItem>
            <CardItem>
              <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                {this.state.machineType}
              </Text>
            </CardItem>
            <Item stackedLabel style={styles.formItem}>
              <Label style={[styles.formLabels, vendorStyles.displayLabels]}>
                Manufacturer
              </Label>
              <Input
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='default'
                style={[styles.inputRegister, styles.input]}
                editable={this.state.editable}
                value={this.state.manufacturer}
                onChangeText={manufacturer => this.setState({ manufacturer })}
              />
            </Item>
            <Item stackedLabel style={styles.formItem}>
              <Label style={[styles.formLabels, vendorStyles.displayLabels]}>
                Model
              </Label>
              <Input
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='default'
                style={[styles.inputRegister, styles.input]}
                editable={this.state.editable}
                value={this.state.model}
                onChangeText={model => this.setState({ model })}
              />
            </Item>
            <Item stackedLabel style={styles.formItem}>
              <Label style={[styles.formLabels, vendorStyles.displayLabels]}>
                Horse Power
              </Label>
              <Input
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='number-pad'
                style={[styles.inputRegister, styles.input]}
                editable={this.state.editable}
                value={this.state.horsePower}
                onChangeText={horsePower => this.setState({ horsePower })}
              />
            </Item>
            <Item stackedLabel style={styles.formItem}>
              <Label style={[styles.formLabels, vendorStyles.displayLabels]}>
                Year Of Manufacturing
              </Label>
              <Input
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='number-pad'
                style={[styles.inputRegister, styles.input]}
                editable={this.state.editable}
                value={this.state.yearOfManufacturing}
                onChangeText={yearOfManufacturing =>
                  this.setState({ yearOfManufacturing })
                }
              />
            </Item>
            <Item stackedLabel style={styles.formItem}>
              <Label style={[styles.formLabels, vendorStyles.displayLabels]}>
                Condition
              </Label>
              <Picker
                style={[styles.picker, { marginLeft: -15 }]}
                mode='dropdown'
                fontSize='18'
                placeholderStyle={{
                  color: '#4d4d51',
                  justifyContent: 'flex-start',
                  fontSize: 18
                }}
                selectedValue={this.state.condition}
                enabled={this.state.editable}
                onValueChange={condition => this.setState({ condition })}
              >
                <Picker.Item label='Used' value='Used' />
                <Picker.Item label='Not used' value='Not used' />
              </Picker>
            </Item>
            <Item stackedLabel style={styles.formItem}>
              <Label style={[styles.formLabels, vendorStyles.displayLabels]}>
                Description
              </Label>
              <Input
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='default'
                style={[styles.inputRegister, styles.input]}
                editable={this.state.editable}
                value={this.state.description}
                onChangeText={description => this.setState({ description })}
              />
            </Item>
            <Item stackedLabel style={styles.formItem}>
              <Label style={[styles.formLabels, vendorStyles.displayLabels]}>
                Pricing method
              </Label>
              <Picker
                style={[styles.picker, { marginLeft: -15 }]}
                mode='dropdown'
                fontSize='18'
                placeholderStyle={{
                  color: '#4d4d51',
                  justifyContent: 'flex-start',
                  fontSize: 18
                }}
                selectedValue={this.state.pricingType}
                enabled={this.state.editable}
                onValueChange={pricingType => this.setState({ pricingType })}
              >
                <Picker.Item label='Per Day Pricing' value='Per Day Pricing' />
                <Picker.Item
                  label='Per Hour Pricing'
                  value='Per Hour Pricing'
                />
              </Picker>
            </Item>
            <Item stackedLabel style={styles.formItem}>
              <Label style={[styles.formLabels, vendorStyles.displayLabels]}>
                Price &#8377;
              </Label>
              <Input
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='decimal-pad'
                style={[styles.inputRegister, styles.input]}
                value={this.state.price}
                editable={this.state.editable}
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
              <Text
                style={[
                  styles.formLabels,
                  vendorStyles.displayLabels,
                  { marginLeft: -15 }
                ]}
              >
                Security deposit
              </Text>
              <Switch
                value={this.state.securityDeposit}
                disabled={!this.state.editable}
                onValueChange={() => this.toggleDeposit()}
              />
            </View>
            <Item stackedLabel style={styles.formItem}>
              <Label style={[styles.formLabels, vendorStyles.displayLabels]}>
                Policy
              </Label>
              <Input
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='default'
                style={[styles.inputRegister, styles.input]}
                editable={this.state.editable}
                value={this.state.policy}
                onChangeText={policy => this.setState({ policy })}
              />
            </Item>
            <Item style={styles.formItem}>
              <Button
                transparent
                full
                style={{ marginTop: 5, alignSelf: 'center' }}
                onPress={() => this.deleteMachine()}
              >
                <Text
                  style={{ color: '#CE3C3E', fontWeight: 'bold', fontSize: 16 }}
                >
                  Delete this machine
                </Text>
              </Button>
            </Item>
          </Form>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
