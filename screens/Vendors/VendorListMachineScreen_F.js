import React from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
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
import { styles } from '../../components/Styles';

export default class VendorListMachineScreen extends React.Component {
  static navigationOptions = {
    title: 'List Machine',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    }
  };

  render() {
    return (
      <SafeAreaView style={vendorStyles.container}>
        <ScrollView contentContainerStyle={styles.container}>
          <KeyboardAwareScrollView>
            <View style={vendorStyles.machineImage} />
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
