import React from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Modal,
  RefreshControl
} from 'react-native';
import { Card, CardItem, Right } from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';

export default class VendorEarningScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingData: [],
      totalEarnings: 0,
      loading: false,
      modalVisible: false,
      currentObject: {},
      fname: '',
      lname: ''
    };
  }

  async componentDidMount() {
    await this.setState({ loading: true });
    let currentUser = firebase.auth().currentUser.email;
    currentUser = currentUser.replace(new RegExp('\\.', 'g'), '_');
    const dbRef = firebase.database().ref('farmerBookings');
    dbRef.once('value').then(async snapshot => {
      let farmersEmail = Object.keys(snapshot.val());
      console.log(farmersEmail);
      let allAds = [];
      await farmersEmail.map(email =>
        allAds.push(Object.values(snapshot.val()[email]))
      );
      allAds = await allAds.flat();
      allAds = allAds.filter(item => item.vendorEmail === currentUser);
      console.log(allAds);

      const sum = allAds.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.cost;
      }, 0);
      // console.log(sum);
      // console.log(allAds.length);

      await this.setState({
        bookingData: allAds,
        totalEarnings: sum,
        loading: false
      });

      console.log(this.state.bookingData[0].farmerId.split('@'));
    });
  }

  static navigationOptions = {
    title: 'Earnings',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    }
  };

  showBookingDetailsModal = flag => {
    this.setState({ modalVisible: flag });
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
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => this.componentDidMount()}
            refreshing={this.state.loading}
          />
        }
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: '#000',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                alignSelf: 'flex-end',
                marginRight: 5
              }}
              onPress={() =>
                this.showBookingDetailsModal(!this.state.modalVisible)
              }
            >
              <Text style={{ fontWeight: 'bold', color: '#fff' }}>Close</Text>
            </TouchableOpacity>
            <Card
              style={{
                padding: 10,
                width: Dimensions.get('screen').width - 10,
                borderRadius: 10
              }}
            >
              <CardItem style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'left'
                  }}
                >
                  Machine type: {this.state.currentObject.machineType}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginTop: 5,
                    textAlign: 'left'
                  }}
                >
                  Earning: &#8377;{this.state.currentObject.cost}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  Booking date: {this.state.currentObject.bookingDate}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  From: {this.state.currentObject.fromDate}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  To: {this.state.currentObject.toDate}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  Farmer name: {this.state.fname} {this.state.lname}
                </Text>
              </CardItem>
            </Card>
          </View>
        </Modal>

        <Card style={{ width: Dimensions.get('screen').width - 10 }}>
          <CardItem>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Summary</Text>
          </CardItem>
          <CardItem>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Total Earnings: &#8377;{this.state.totalEarnings}
            </Text>
          </CardItem>
          <CardItem style={{}}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Total times your machines are booked:{' '}
              {this.state.bookingData.length}
            </Text>
          </CardItem>
        </Card>

        <Card
          style={{
            width: Dimensions.get('screen').width - 10,
            marginTop: 10,
            paddingBottom: 10
          }}
        >
          <CardItem>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Details</Text>
          </CardItem>
          <CardItem>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Booking dates{' '}
            </Text>
          </CardItem>
          <FlatList
            scrollsToTop={true}
            data={this.state.bookingData}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    let name = item.farmerId.split('@');
                    let fname = name[0].split('_')[0];
                    let lname = name[0].split('_')[1];
                    this.setState({ currentObject: item, fname, lname });
                    this.showBookingDetailsModal(true);
                  }}
                >
                  <Card
                    style={{
                      width: Dimensions.get('window').width - 30,
                      alignSelf: 'center'
                    }}
                  >
                    <CardItem>
                      <Text style={{ fontWeight: '500' }}>
                        {item.bookingDate}
                        {' - '}&#8377;{item.cost}
                      </Text>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.adKey.toString()}
          />
        </Card>
      </ScrollView>
    );
  }
}
