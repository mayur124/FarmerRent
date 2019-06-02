import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions
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

export default class VendorMachineDescriptionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      horsePower: '',
      condition: '',
      tags: '',
      description: ''
    };
    this.listItem = {};
  }

  static navigationOptions = {
    title: 'Description',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    }
  };

  componentDidMount() {
    this.listItem = this.props.navigation.getParam('listMachineData');
    // console.log('\nlistItem Data:\n', this.listItem);
  }

  validateData = () => {
    this.props.navigation.navigate('MachinePricing');
  };

  render() {
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
                <CardItem>
                  <Text style={vendorStyles.subHeadingText}>Specification</Text>
                </CardItem>
                <CardItem />
                <Form style={{ justifyContent: 'center' }}>
                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>Condition &#x25bc;</Label>
                    <Picker
                      style={[vendorStyles.picker, styles.picker]}
                      mode='dropdown'
                      fontSize='18'
                      placeholderStyle={{
                        color: '#4d4d51',
                        justifyContent: 'flex-start',
                        fontSize: 18
                      }}
                      selectedValue={this.state.condition}
                      onValueChange={itemValue =>
                        this.setState({ condition: itemValue })
                      }
                    >
                      <Picker.Item label='Used' value='Used' />
                      <Picker.Item label='Not used' value='Not used' />
                    </Picker>
                  </Item>

                  <Item stackedLabel style={styles.formItem}>
                    <Label style={styles.formLabels}>Horse Power (hp)</Label>
                    <Input
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='decimal-pad'
                      style={[styles.inputRegister, styles.input]}
                      onChangeText={horsePower => this.setState({ horsePower })}
                    />
                  </Item>

                  <CardItem>
                    <Text style={vendorStyles.subHeadingText}>Tags</Text>
                  </CardItem>
                  <Text style={{ textAlign: 'center' }}>
                    (For better indexing of your machine)
                  </Text>
                  <Item style={styles.formItem}>
                    <Textarea
                      rowSpan={5}
                      bordered
                      style={{
                        width: '95%',
                        borderColor: '#EAF0F1',
                        backgroundColor: '#f4f4f4'
                      }}
                      placeholder='Please enter space separated tags'
                      onChangeText={tags => {
                        this.setState({ tags });
                      }}
                    />
                  </Item>

                  <CardItem>
                    <Text style={vendorStyles.subHeadingText}>Description</Text>
                  </CardItem>
                  <Item style={styles.formItem}>
                    <Textarea
                      rowSpan={5}
                      style={{
                        width: '95%',
                        borderColor: '#EAF0F1',
                        backgroundColor: '#f4f4f4'
                      }}
                      bordered
                      onChangeText={description => {
                        this.setState({ description });
                      }}
                    />
                  </Item>

                  <Button
                    block
                    style={[styles.loginButton, { marginTop: 15 }]}
                    onPress={() => {
                      this.validateData();
                    }}
                  >
                    <Text style={{ color: '#D9AE3C', fontWeight: 'bold' }}>
                      Next (2/3) &#9654;
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
