import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Card, Button, Input, Item, CardItem, Icon } from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';

export default class FarmerSearchMachines_McTyp extends React.Component {
  _check = false;

  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      loading: false
    };
  }

  async componentDidMount() {
    await this.setState({ loading: true });
    this._check = true;

    let dbRef = firebase.database().ref('vendorAds');
    if (this._check) {
      dbRef.once('value', async snapshot => {
        let vendorsKeys = Object.keys(snapshot.val());
        // console.log(vendorsKeys); // -- contains email of vendors

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

        joinedAdValues = joinedAdValues.filter(
          item =>
            item.machineType === this.props.navigation.getParam('machineType')
        );

        // console.log(joinedAdValues);

        await this.setState({
          ads: joinedAdValues,
          loading: false
        });
        // console.log(this.state.ads);
      });
    }
  }

  static navigationOptions = {
    title: 'Search',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#A18F78',
      textAlign: 'center'
    }
  };

  componentWillUnmount() {
    this._check = false;
  }

  sortMachines = async sortingType => {
    if (sortingType === 'price') {
      await this.state.ads.sort((a, b) => a.price - b.price);
    } else {
      await this.state.ads.sort(
        (a, b) => b.pricingType.length - a.pricingType.length
      );
    }
    await this.forceUpdate();
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return (
      <View style={vendorStyles.container}>
        <Card style={{ width: Dimensions.get('screen').width - 10 }}>
          <CardItem>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Sort by:</Text>
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
                backgroundColor: '#BFBFBF',
                width: '40%',
                justifyContent: 'center'
              }}
              onPress={() => this.sortMachines('price')}
            >
              <Text style={{ fontWeight: '500' }}>Price</Text>
            </Button>
            <Button
              transparent
              style={{
                paddingHorizontal: 10,
                borderRadius: 10,
                backgroundColor: '#BFBFBF',
                width: '40%',
                justifyContent: 'center'
              }}
              onPress={() => this.sortMachines('pricingType')}
            >
              <Text style={{ fontWeight: '500' }}>Pricing Type</Text>
            </Button>
          </CardItem>
        </Card>
        <FlatList
          ListEmptyComponent={
            <View style={styles.container}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center'
                }}
              >
                No machines found
              </Text>
            </View>
          }
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
          data={this.state.ads}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('FarmerMachineDetail', {
                    item: item
                  })
                }
              >
                <Card style={{ width: Dimensions.get('screen').width - 20 }}>
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
                      <Text style={{ fontWeight: 'bold' }}>
                        City / Village:
                      </Text>
                      <Text>{item.city}</Text>
                    </View>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.key.toString()}
        />
      </View>
    );
  }
}
