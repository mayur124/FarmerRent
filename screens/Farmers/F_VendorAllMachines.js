import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Card, Button, Input, Item, CardItem, Icon } from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';

export default class F_VendorAllMachines extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      adsArray: [],
      inMemoryAdsArray: [],
      initialImage: '',
      loading: false,
      vendorName: ''
    };
  }

  async componentDidMount() {
    await this.setState({ loading: true });
    this._isMounted = true;
    let currentFirebaseVendor = await this.props.navigation.getParam('vendor');

    if ((this._isMounted = true)) {
      let dbReference = await firebase
        .database()
        .ref('vendorAds/' + currentFirebaseVendor);

      let userDbRef = await firebase
        .database()
        .ref('users/vendors/' + currentFirebaseVendor);
      userDbRef.once('value', async snapshot => {
        let adValues = await Object.values(snapshot.val());
        await this.setState({
          vendorName: adValues[0].fname + ' ' + adValues[0].lname
        });
      });

      dbReference.once('value', async snapshot => {
        if (snapshot.val()) {
          let adKeys = await Object.keys(snapshot.val());
          let adValues = await Object.values(snapshot.val());
          // console.log(adKeys);
          // console.log(adValues);
          adValues.map((adData, index) => {
            adData['key'] = adKeys[index];
            // console.log('------------------------------------------');
            // console.log(adData);
            // console.log('------------------------------------------');
          });
          await this.setState({
            adsArray: adValues,
            inMemoryAdsArray: adValues,
            loading: false
          });

          // console.log(this.state.adsArray);
        }
      });
    }
    this.forceUpdate();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  searchMachine = machineType => {
    const filteredMachine = this.state.inMemoryAdsArray.filter(machine => {
      let machineLowerCase = machine.machineType.toLowerCase();
      let searchLowerCase = machineType.toLowerCase();
      return machineLowerCase.indexOf(searchLowerCase) > -1;
    });

    this.setState({ adsArray: filteredMachine });
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
      <ScrollView contentContainerStyle={vendorStyles.container}>
        <Item style={styles.formItem}>
          <Input
            autoCapitalize='none'
            style={[styles.input, { alignContent: 'center' }]}
            placeholder='Search - E.g. Tractor'
            onChangeText={machineType => this.searchMachine(machineType)}
          />
        </Item>
        <Text style={{ fontWeight: 'bold', fontSize: 25 }}>
          {this.state.vendorName}
        </Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
          {this.state.adsArray.length} Equipments
        </Text>
        <FlatList
          horizontal={true}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
          data={this.state.adsArray}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('F_VendorMachineDetail', {
                    item: item
                  })
                }
              >
                <Card style={{ marginHorizontal: 5 }}>
                  <CardItem style={{ flexDirection: 'column' }}>
                    <Image
                      style={{
                        borderRadius: 2,
                        borderColor: '#EAF0F1',
                        backgroundColor: '#f4f4f4',
                        height: 150,
                        width: 150
                      }}
                      source={{ uri: item.imagePaths[0] }}
                    />

                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        flexWrap: 'wrap',
                        marginTop: 5
                      }}
                    >
                      {item.machineType}
                    </Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 5 }}>
                      Price:
                    </Text>
                    <Text>
                      &#8377;{item.price}
                      {item.pricingType === 'Per Day Pricing'
                        ? '/day'
                        : '/hour'}
                    </Text>
                    <Text style={{ fontWeight: 'bold' }}>State:</Text>
                    <Text>{item.state}</Text>
                    <Text style={{ fontWeight: 'bold' }}>City/Village:</Text>
                    <Text>{item.city}</Text>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.key.toString()}
        />
      </ScrollView>
    );
  }
}
