import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Card, CardItem, Button } from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';

export default class FarmerHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: {}
    };
  }

  componentDidMount() {
    let dbRef = firebase.database().ref('vendorAds');
    dbRef.once('value', async snapshot => {
      let vendorsKeys = Object.keys(snapshot.val());
      // console.log(vendorsKeys);

      let adKeys = [];
      vendorsKeys.map(item => adKeys.push(Object.keys(snapshot.val()[item])));
      let adValues = [];
      vendorsKeys.map(item =>
        adValues.push(Object.values(snapshot.val()[item]))
      );
      // console.log(adValues);

      let joinedAdKeys = [];
      adKeys.map(item => item.map(key => joinedAdKeys.push(key.toString())));
      // console.log(joinedAdKeys);

      let joinedAdValues = [];
      adValues.map(item => item.map(val => joinedAdValues.push(val)));

      joinedAdValues.map((item, index) => {
        item['key'] = joinedAdKeys[index];
      });
      // console.log(joinedAdValues);

      await this.setState({ ads: joinedAdValues });
    });
  }

  static navigationOptions = {
    title: 'Home',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#A18F78',
      textAlign: 'center'
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={vendorStyles.container}>
        <Card style={{ width: Dimensions.get('screen').width - 20 }}>
          <CardItem>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Search machine by:
            </Text>
          </CardItem>
          <CardItem
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: -10
            }}
          >
            <Button
              transparent
              style={{
                paddingHorizontal: 10,
                borderRadius: 10,
                backgroundColor: '#BFBFBF'
              }}
            >
              <Text style={{ fontWeight: '500' }}>State</Text>
            </Button>
            <Button
              transparent
              style={{
                paddingHorizontal: 10,
                borderRadius: 10,
                backgroundColor: '#BFBFBF'
              }}
            >
              <Text style={{ fontWeight: '500' }}>City / Village</Text>
            </Button>
            <Button
              transparent
              style={{
                paddingHorizontal: 10,
                borderRadius: 10,
                backgroundColor: '#BFBFBF'
              }}
            >
              <Text style={{ fontWeight: '500' }}>Pincode</Text>
            </Button>
          </CardItem>
        </Card>
        <Card style={{ width: Dimensions.get('screen').width - 20 }}>
          <CardItem>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Machine types:
            </Text>
          </CardItem>
          <CardItem>
            <ScrollView horizontal={true} style={{ marginTop: -10 }}>
              <TouchableOpacity>
                <Card>
                  <CardItem style={{ flexDirection: 'column' }}>
                    <Image
                      style={{ height: 100, width: 100, resizeMode: 'cover' }}
                      source={require('../../assets/tractor.jpg')}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    >
                      Tractor
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card>
                  <CardItem style={{ flexDirection: 'column' }}>
                    <Image
                      style={{ height: 100, width: 100, resizeMode: 'cover' }}
                      source={require('../../assets/tillage-equipment.jpg')}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    >
                      Tillage Equipment
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card>
                  <CardItem style={{ flexDirection: 'column' }}>
                    <Image
                      style={{ height: 100, width: 100, resizeMode: 'cover' }}
                      source={require('../../assets/seeding-equipment.jpg')}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    >
                      Seeding Equipment
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card>
                  <CardItem style={{ flexDirection: 'column' }}>
                    <Image
                      style={{ height: 100, width: 100, resizeMode: 'cover' }}
                      source={require('../../assets/landscaping-equipment.jpg')}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    >
                      Landscaping Equipment
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card>
                  <CardItem style={{ flexDirection: 'column' }}>
                    <Image
                      style={{ height: 100, width: 100, resizeMode: 'cover' }}
                      source={require('../../assets/crop-protection.jpg')}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    >
                      Crop Protection
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card>
                  <CardItem style={{ flexDirection: 'column' }}>
                    <Image
                      style={{ height: 100, width: 100, resizeMode: 'cover' }}
                      source={require('../../assets/harvest-equipment.png')}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    >
                      Harvest Equipment
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity>
                <Card>
                  <CardItem style={{ flexDirection: 'column' }}>
                    <Image
                      style={{ height: 100, width: 100, resizeMode: 'cover' }}
                      source={require('../../assets/post-harvest.jpg')}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    >
                      Post Harvest
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            </ScrollView>
          </CardItem>
        </Card>
      </ScrollView>
    );
  }
}
