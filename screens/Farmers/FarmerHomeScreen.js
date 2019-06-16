import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Card, CardItem, Button } from 'native-base';
import * as firebase from 'firebase';
import { styles } from '../../components/Styles';

export default class FarmerHomeScreen extends React.Component {
  _check = false;

  constructor(props) {
    super(props);
    this.state = {
      ads: {},
      isLoading: false
    };
  }

  async componentDidMount() {
    await this.setState({ isLoading: true });
    this._check = true;
    let dbRef = firebase
      .database()
      .ref('vendorAds')
      .limitToFirst(10);
    if (this._check) {
      await dbRef.once('value', async snapshot => {
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
    await this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    this._check = false;
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
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return (
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <Card style={{ width: Dimensions.get('screen').width - 10 }}>
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
              onPress={() =>
                this.props.navigation.navigate('SearchStCtyPn', {
                  searchType: 'state'
                })
              }
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
              onPress={() =>
                this.props.navigation.navigate('SearchStCtyPn', {
                  searchType: 'city'
                })
              }
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
              onPress={() =>
                this.props.navigation.navigate('SearchStCtyPn', {
                  searchType: 'pincode'
                })
              }
            >
              <Text style={{ fontWeight: '500' }}>Pincode</Text>
            </Button>
          </CardItem>
        </Card>
        <Card style={{ width: Dimensions.get('screen').width - 10 }}>
          <CardItem>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Machine types:
            </Text>
          </CardItem>
          <CardItem>
            <ScrollView horizontal={true} style={{ marginTop: -10 }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SearchMchn', {
                    machineType: 'Tractor'
                  })
                }
              >
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
                        fontWeight: '600',
                        marginTop: 5
                      }}
                    >
                      Tractor
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SearchMchn', {
                    machineType: 'Tillage Equipment'
                  })
                }
              >
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
                        fontWeight: '600',
                        marginTop: 5
                      }}
                    >
                      Tillage Equipment
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SearchMchn', {
                    machineType: 'Seeding Equipment'
                  })
                }
              >
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
                        fontWeight: '600',
                        marginTop: 5
                      }}
                    >
                      Seeding Equipment
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SearchMchn', {
                    machineType: 'Landscaping Equipment'
                  })
                }
              >
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
                        fontWeight: '600',
                        marginTop: 5
                      }}
                    >
                      Landscaping Equipment
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SearchMchn', {
                    machineType: 'Crop Protection'
                  })
                }
              >
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
                        fontWeight: '600',
                        marginTop: 5
                      }}
                    >
                      Crop Protection
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SearchMchn', {
                    machineType: 'Harvest Equipment'
                  })
                }
              >
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
                        fontWeight: '600',
                        marginTop: 5
                      }}
                    >
                      Harvest Equipment
                    </Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SearchMchn', {
                    machineType: 'Post Harvest'
                  })
                }
              >
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
                        fontWeight: '600',
                        marginTop: 5
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
        <Card style={{ width: Dimensions.get('screen').width - 10 }}>
          <CardItem>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              Equipments from vendors:
            </Text>
          </CardItem>
          <FlatList
            scrollsToTop={true}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
            data={this.state.ads}
            ListFooterComponent={
              <Button
                onPress={() =>
                  this.props.navigation.navigate('FarmerAllMachines')
                }
                style={{
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: '#BFBFBF',
                  margin: 5,
                  width: '100%'
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>View all machines</Text>
              </Button>
            }
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('FarmerMachineDetail', {
                      item: item
                    })
                  }
                >
                  <Card style={{ width: Dimensions.get('screen').width - 10 }}>
                    <CardItem>
                      <Image
                        style={{
                          borderRadius: 2,
                          borderColor: '#EAF0F1',
                          backgroundColor: '#f4f4f4',
                          height: 100,
                          width: 100
                        }}
                        source={{ uri: item.imagePaths[0] }}
                      />
                      <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            flexWrap: 'wrap'
                          }}
                        >
                          {item.machineType}
                        </Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                          Pricing type:
                        </Text>
                        <Text>{item.pricingType}</Text>
                        <Text style={{ fontWeight: 'bold' }}>Price:</Text>
                        <Text>&#8377;{item.price}</Text>
                      </View>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              );
            }}
          />
        </Card>
      </ScrollView>
    );
  }
}
