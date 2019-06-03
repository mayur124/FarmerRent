import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator
} from 'react-native';
import { styles, vendorStyles } from '../../components/Styles';
import { FontAwesome } from '@expo/vector-icons';
import { ImagePicker } from 'expo';

export default class MyCamera extends React.Component {
  static navigationOptions = {
    title: 'Take Pictures',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      images: []
    };
  }

  componentDidMount() {
    this.takePicture();
  }

  takePicture = () => {
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
            'Another Picture? ',
            null,
            [
              {
                text: 'Yes',
                onPress: () => this.takePicture()
              },
              { text: 'No' }
            ],
            { cancelable: false }
          );
        }
        console.log(this.state);
      })
      .catch(error => console.log(error));
  };

  render() {
    return <View style={[styles.container, { backgroundColor: 'black' }]} />;
  }
}