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
      //   type: Camera.Constants.Type.back,
      //   isFlashLightOn: Camera.Constants.FlashMode.off,
      //   flashColor: '#fff',
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
        }
        console.log(this.state);
      })
      .then(async () => {
        await Alert.alert(
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
      })
      .catch(error => console.log(error));
  };

  render() {
    if (this.state.images.length === 0) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return <View style={styles.container} />;
  }
}

/*
    <ImagePicker
            style={vendorStyles.cameraView}
            type={this.state.type}
            flashMode={this.state.isFlashLightOn}
            ref={ref => {
                this.camera = ref
            }}
        >
            
        </ImagePicker>
*/
