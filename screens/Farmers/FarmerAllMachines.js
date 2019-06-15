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

export default class FarmerAllMachines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      inMemoryAds: []
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

      await this.setState({ ads: joinedAdValues, inMemoryAds: joinedAdValues });
      // console.log(this.state.ads);
    });
  }

  static navigationOptions = {
    title: 'All machines',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#A18F78',
      textAlign: 'center'
    }
  };

  searchMachine = machineType => {
    const filteredMachine = this.state.inMemoryAds.filter(machine => {
      let machineLowerCase = machine.machineType.toLowerCase();
      let searchLowerCase = machineType.toLowerCase();
      return machineLowerCase.indexOf(searchLowerCase) > -1;
    });

    this.setState({ ads: filteredMachine });
  };

  render() {
    return (
      <View style={vendorStyles.container}>
        <CardItem header bordered>
          <Item style={styles.formItem}>
            <Input
              autoCapitalize='none'
              style={[styles.input, { alignContent: 'center' }]}
              placeholder='Search - E.g. Tractor'
              onChangeText={machineType => this.searchMachine(machineType)}
            />
          </Item>
        </CardItem>
        <FlatList
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
