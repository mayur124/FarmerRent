import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { styles, vendorStyles } from '../../components/Styles';
import { Button } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import * as firebase from 'firebase';

export default class VendorEquipmentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: ''
    };
  }

  _isMounted = false;

  componentWillMount() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' />
        <Text>Just a moment</Text>
      </View>
    );
  }

  addMachine = () => {
    // alert("Add machine")
    this.props.navigation.navigate('ListMachine');
  };

  viewMachines = () => {
    // alert("View machine")
    this.props.navigation.navigate('VendorMachines');
  };

  componentDidMount() {
    this._isMounted = true;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (this._isMounted) {
          this.setState({
            userEmail: user.email
          });
        }
      } else {
        this.props.navigation.navigate('SignIn');
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = {
    title: 'Equipments',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    },
    headerLeft: null
  };

  render() {
    return (
      <SafeAreaView style={vendorStyles.container}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: Dimensions.get('screen').height / 2 - 200,
              flexWrap: 'wrap'
            }}
          >
            Welcome, {`${firebase.auth().currentUser.displayName}`}
          </Text>
          <Button
            style={[
              vendorStyles.button,
              { width: Dimensions.get('screen').width / 2, marginTop: 60 }
            ]}
            onPress={() => this.addMachine()}
          >
            <Text style={vendorStyles.buttonText}>Add machine</Text>
            <FontAwesome
              name='plus-circle'
              style={[vendorStyles.buttonText, { marginLeft: 5, fontSize: 15 }]}
            />
          </Button>

          <Button
            style={[
              vendorStyles.button,
              { width: Dimensions.get('screen').width / 2 }
            ]}
            onPress={() => this.viewMachines()}
          >
            <Text style={vendorStyles.buttonText}>View my machines</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}
