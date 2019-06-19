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

export default class FarmerSearchMachines_StCtyPn extends React.Component {
  _check = false;

  constructor(props) {
    super(props);
    this.state = {
      searchType: '',
      loading: true,
      ads: [],
      inMemoryAds: []
    };
  }

  async componentDidMount() {
    await this.setState({
      searchType: this.props.navigation.getParam('searchType')
    });
    this._check = true;
    let dbRef = await firebase.database().ref('vendorAds');
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

        await this.setState({
          ads: joinedAdValues,
          inMemoryAds: joinedAdValues
        });
        // console.log(this.state.ads);
      });
    }

    await this.setState({ loading: false });
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

  searchMachine = machineType => {
    const filteredMachine = this.state.inMemoryAds.filter(machine => {
      let machineLowerCase = machine[this.state.searchType].toLowerCase();
      let searchLowerCase = machineType.toLowerCase();
      return machineLowerCase.indexOf(searchLowerCase) > -1;
    });

    this.setState({ ads: filteredMachine });
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
        <CardItem header bordered>
          <Item style={styles.formItem}>
            <Input
              autoCapitalize='none'
              style={[styles.input, { alignContent: 'center' }]}
              placeholder={
                this.state.searchType === 'city'
                  ? 'Search ' + this.state.searchType + '/village'
                  : 'Search ' + this.state.searchType
              }
              onChangeText={machineType => this.searchMachine(machineType)}
            />
          </Item>
        </CardItem>
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
                No machines matching search
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
                        {this.state.searchType === 'state'
                          ? 'State:'
                          : 'City/Village:'}
                      </Text>
                      <Text>{item[this.state.searchType]}</Text>
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
