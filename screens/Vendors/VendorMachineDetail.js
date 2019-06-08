import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  Button
} from 'react-native';
import { styles, vendorStyles } from '../../components/Styles';
export default class VendorMachineDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLoading: true,
      editBtnClicked: false
    };
  }

  async componentDidMount() {
    await this.setState({ data: this.props.navigation.getParam('item') });
    await this.setState({ isLoading: false });
    await console.log('comdMount: ', this.state.data);
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Details'),
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#D9AE3C',
        textAlign: 'center'
      },
      headerRight: (
        <Button
          onPress={() => alert('This is a button!')}
          title='Edit'
          color='#D9AE3C'
        />
      )
    };
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
              height: 200,
              width: 200,
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
        </View>
      );
    });
    console.log('state images: ', this.state.images);

    return temp_image;
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
        <ScrollView horizontal={true} style={{ flex: 1, flexDirection: 'row' }}>
          {this.showImages()}
        </ScrollView>
      </View>
    );
  }
}
