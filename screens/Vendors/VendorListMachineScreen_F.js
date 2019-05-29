import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  ActionSheetIOS
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
import { Camera, ImagePicker, Permissions } from 'expo';

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

  takePictures = async () => {
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
              this.props.navigation.navigate('MyCamera');
              break;
            case 1:
              // 'Choose picture => Open CameraRoll'
              break;
            case 2:
              // 'Cancel'
              break;
            default:
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
      // this.state.images.length !== 0 &&
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
      }

      if (modelRegex.test(model) === false) {
        Alert.alert('Invalid model');
        return;
      }

      if (yearRegex.test(yearOfManufacturing) === false) {
        Alert.alert('Invalid year');
        return;
      } else if (
        yearOfManufacturing < 2000 ||
        yearOfManufacturing > d.getFullYear()
      ) {
        Alert.alert('Valid year range is from 2000 to ' + d.getFullYear());
        return;
      }
    } else {
      Alert.alert('Please fill all the fields');
      return;
    }
  };

  render() {
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
                    onPress={() => this.takePictures()}
                  >
                    <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
                      Add Image
                    </Text>
                  </Button>
                </View>
              </CardItem>
              <Form style={{ justifyContent: 'center' }}>
                <Item stackedLabel style={styles.formItem}>
                  <Label style={styles.formLabels}>Machine Type &#x25bc;</Label>
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
                  <Label style={styles.formLabels}>Year of manufacturing</Label>
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
                    Next &#9654;
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
