import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  Switch,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  CardItem,
  Button,
  Form,
  Item,
  Label,
  Picker,
  Input,
  Textarea
} from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class VendorMachineDetail extends React.Component {
  constructor(props) {
    super(props);
    self = this;
    this.state = {
      data: {},
      isLoading: true,
      editDoneText: 'Edit',
      editComponentStyle: 'none',
      editBtnStyle: 'flex',
      doneBtnStyle: 'none',
      editable: false
    };
  }

  async componentDidMount() {
    await this.setState({ data: this.props.navigation.getParam('item') });
    await this.setState({ isLoading: false });
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
    this.state.data.imagePaths.map((item, index) => {
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
    // console.log('state images: ', this.state.images);

    return temp_image;
  };

  toggleEdit = () => {
    this.setState({
      editComponentStyle:
        this.state.editComponentStyle === 'none' ? 'flex' : 'none',
      editDoneText: this.state.editDoneText === 'Edit' ? 'Done' : 'Edit',
      editable: this.state.editable === false ? true : false
    });
    if (this.state.editDoneText === 'Done') alert('Done');
  };

  render() {
    if (this.state.isLoading)
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
          <Text>Loading</Text>
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
            <CardItem>
              <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                {this.state.data.machineType}
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
                value={this.state.data.manufacturer}
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
                value={this.state.data.model}
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
                value={this.state.data.horsePower}
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
                value={this.state.data.yearOfManufacturing}
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
                selectedValue={this.state.data.condition}
                enabled={this.state.editable}
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
                value={this.state.data.description}
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
                selectedValue={this.state.data.pricingType}
                enabled={this.state.editable}
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
                value={this.state.data.price}
                editable={this.state.editable}
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
                value={this.state.data.securityDeposit}
                disabled={!this.state.editable}
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
                value={this.state.data.policy}
              />
            </Item>
          </Form>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
