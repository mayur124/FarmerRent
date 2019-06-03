import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  ActionSheetIOS,
  Image,
  TouchableOpacity
} from 'react-native';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles, vendorStyles } from '../../components/Styles';
import { ImagePicker, Permissions } from 'expo';

export default class VendorListMachineScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      machineType: '',
      manufacturer: '',
      model: '',
      yearOfManufacturing: ''
    };
  }

  static navigationOptions = {
    title: 'List Machine',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    }
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

    if (this.state.hasCameraPermission && this.state.hasGalleryPermission) {
      ImagePicker.launchCameraAsync({
        aspect: [1, 1],
        quality: 0.2,
        base64: true
      })
        .then(async result => {
          if (!result.cancelled) {
            await this.setState({
              images: this.state.images.concat(result.uri)
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
          // console.log(this.state.images);
        })
        .catch(error => console.log(error));
    }
  };

  takePictures = async () => {
    //this method is not required now.
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    this.setState({
      hasCameraPermission: status === 'granted',
      hasGalleryPermission: status === 'granted'
    });

    if (this.state.hasCameraPermission && this.state.hasGalleryPermission) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Take Pictures', 'Choose Images', 'Cancel'],
          cancelButtonIndex: 2,
          destructiveButtonIndex: 2
        },
        buttonIndex => {
          switch (buttonIndex) {
            case 0:
              // 'Take picture => Open Camera'
              this.openCamera();
              break;
            case 1:
              // 'Choose picture => Open CameraRoll'
              this.openGallery();
              break;
          }
        }
      );
    } else {
      Alert.alert('Please grant Camera and Gallery permission');
      return;
    }
  };

  validateData = () => {
    if (
      this.state.images.length !== 0 &&
      this.state.machineType !== '' &&
      this.state.manufacturer !== '' &&
      this.state.model !== '' &&
      this.state.yearOfManufacturing !== ''
    ) {
      const manufacturerRegex = RegExp('^[a-zA-Z]{3,}$', 'g');
      const modelRegex = RegExp('[\\w\\d]{3,}', 'g');
      const yearRegex = RegExp('^[\\d]{4}', 'g');
      const { manufacturer, model, yearOfManufacturing } = this.state;
      const d = new Date();
      if (manufacturerRegex.test(manufacturer) === false) {
        Alert.alert('Invalid Manufacturer');
        return;
      } else if (modelRegex.test(model) === false) {
        Alert.alert('Invalid model');
        return;
      } else if (yearRegex.test(yearOfManufacturing) === false) {
        Alert.alert('Invalid year');
        return;
      } else if (
        yearOfManufacturing < 2000 ||
        yearOfManufacturing > d.getFullYear()
      ) {
        Alert.alert('Valid year range is from 2000 to ' + d.getFullYear());
        return;
      } else {
        this.props.navigation.navigate('MachineDescription', {
          listMachineData: this.state
        });
      }
    } else {
      Alert.alert('Please fill all the fields');
      return;
    }
  };

  removeImage = index => {
    Alert.alert('Delete this image?', null, [
      {
        text: 'Yes',
        onPress: () => {
          this.state.images.splice(index, 1);
          // console.log(this.state.images);
          this.forceUpdate();
        }
      },
      { text: 'No' }
    ]);
  };

  showImages = () => {
    let temp_image = [];
    this.state.images.map((item, index) => {
      let tempKey = item + '123';
      temp_image.push(
        <View key={tempKey}>
          <View
            key={index}
            style={{
              height: 100,
              width: 100,
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
          <View key={index + 1}>
            <TouchableOpacity
              key={index + 2}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
                width: '100%'
              }}
              onPress={() => {
                this.removeImage(index);
                this.forceUpdate();
              }}
            >
              <Text
                key={index + 3}
                style={{
                  alignSelf: 'center',
                  color: '#CE3C3E',
                  fontWeight: 'bold'
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
    // console.log('state images: ', this.state.images);

    return temp_image;
  };

  render() {
    if (this.state.images.length === 0) {
      return (
        <SafeAreaView style={vendorStyles.container}>
          <ScrollView contentContainerStyle={styles.container}>
            <KeyboardAwareScrollView>
              <Card
                style={{
                  width: Dimensions.get('screen').width - 20,
                  paddingBottom: 15
                }}
              >
                <CardItem>
                  <View style={vendorStyles.machineImage}>
                    <Button
                      block
                      style={styles.loginButton}
                      onPress={() => this.openCamera()}
                    >
                      <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
                        Add Images
                      </Text>
                    </Button>
                  </View>
                </CardItem>
                <Form style={{ justifyContent: 'center' }}>
                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>
                      Machine Type &#x25bc;
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
                      selectedValue={this.state.machineType}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ machineType: itemValue })
                      }
                    >
                      <Picker.Item label='Tractor' value='Tractor' />
                      <Picker.Item
                        label='Tillage Equipment'
                        value='Tillage Equipment'
                      />
                      <Picker.Item
                        label='Seeding Equipment'
                        value='Seeding Equipment'
                      />
                      <Picker.Item
                        label='Landscaping Equipment'
                        value='Landscaping Equipment'
                      />
                      <Picker.Item
                        label='Crop Protection'
                        value='Crop Protection'
                      />
                      <Picker.Item
                        label='Harvest Equipment'
                        value='Harvest Equipment'
                      />
                      <Picker.Item label='Post Harvest' value='Post Harvest' />
                    </Picker>
                  </Item>
                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>Manufacturer</Label>
                    <Input
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='default'
                      style={[styles.inputRegister, styles.input]}
                      onChangeText={manufacturer =>
                        this.setState({ manufacturer })
                      }
                    />
                  </Item>
                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>Model</Label>
                    <Input
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='default'
                      onChangeText={model => this.setState({ model })}
                      style={[styles.inputRegister, styles.input]}
                    />
                  </Item>
                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>
                      Year of manufacturing
                    </Label>
                    <Input
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='number-pad'
                      onChangeText={yearOfManufacturing =>
                        this.setState({ yearOfManufacturing })
                      }
                      style={[styles.inputRegister, styles.input]}
                    />
                  </Item>
                  <Button
                    onPress={() => this.validateData()}
                    block
                    style={styles.loginButton}
                  >
                    <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
                      Next (1/3) &#9654;
                    </Text>
                  </Button>
                </Form>
              </Card>
            </KeyboardAwareScrollView>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={vendorStyles.container}>
          <ScrollView contentContainerStyle={styles.container}>
            <KeyboardAwareScrollView>
              <Card
                style={{
                  width: Dimensions.get('screen').width - 20,
                  paddingBottom: 15
                }}
              >
                <CardItem>
                  <View style={vendorStyles.machineImage}>
                    <Button
                      block
                      style={styles.loginButton}
                      onPress={() => this.openCamera()}
                    >
                      <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
                        Add Images
                      </Text>
                    </Button>
                  </View>
                </CardItem>
                <CardItem>
                  <ScrollView
                    horizontal={true}
                    style={{ flex: 1, flexDirection: 'row' }}
                  >
                    {this.showImages()}
                  </ScrollView>
                </CardItem>
                <Form style={{ justifyContent: 'center' }}>
                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>
                      Machine Type &#x25bc;
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
                      selectedValue={this.state.machineType}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ machineType: itemValue })
                      }
                    >
                      <Picker.Item label='Tractor' value='Tractor' />
                      <Picker.Item
                        label='Tillage Equipment'
                        value='Tillage Equipment'
                      />
                      <Picker.Item
                        label='Seeding Equipment'
                        value='Seeding Equipment'
                      />
                      <Picker.Item
                        label='Landscaping Equipment'
                        value='Landscaping Equipment'
                      />
                      <Picker.Item
                        label='Crop Protection'
                        value='Crop Protection'
                      />
                      <Picker.Item
                        label='Harvest Equipment'
                        value='Harvest Equipment'
                      />
                      <Picker.Item label='Post Harvest' value='Post Harvest' />
                    </Picker>
                  </Item>
                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>Manufacturer</Label>
                    <Input
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='default'
                      style={[styles.inputRegister, styles.input]}
                      onChangeText={manufacturer =>
                        this.setState({ manufacturer })
                      }
                    />
                  </Item>
                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>Model</Label>
                    <Input
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='default'
                      onChangeText={model => this.setState({ model })}
                      style={[styles.inputRegister, styles.input]}
                    />
                  </Item>
                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>
                      Year of manufacturing
                    </Label>
                    <Input
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='number-pad'
                      onChangeText={yearOfManufacturing =>
                        this.setState({ yearOfManufacturing })
                      }
                      style={[styles.inputRegister, styles.input]}
                    />
                  </Item>
                  <Button
                    onPress={() => this.validateData()}
                    block
                    style={styles.loginButton}
                  >
                    <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
                      Next (1/3) &#9654;
                    </Text>
                  </Button>
                </Form>
              </Card>
            </KeyboardAwareScrollView>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}
