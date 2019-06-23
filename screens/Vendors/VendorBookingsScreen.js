import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Card, CardItem } from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';

export default class VendorBookingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingDetails: [],
      loading: false
    };
  }

  async componentDidMount() {
    await this.setState({ loading: true });
    let currentUser = firebase.auth().currentUser.email;
    currentUser = currentUser.replace(new RegExp('\\.', 'g'), '_');
    let dbRef = firebase.database().ref('farmerBookings');
    // let bookedAdKeys = [];
    await dbRef.once('value', async snapshot => {
      let farmersWhoBooked = Object.keys(snapshot.val());
      let allBookings = farmersWhoBooked.map(item =>
        Object.values(snapshot.val()[item])
      );
      allBookings = allBookings.flat();
      allBookings = allBookings.filter(
        item => item.vendorEmail.trim() === currentUser.trim()
      );
      console.log('\nAFTER allBookings\n', allBookings);
      await this.setState({ bookingDetails: allBookings });
      // await allBookings.map(item => bookedAdKeys.push(item.adKey));
    });

    await this.setState({ loading: false });
    //#region Not needed now but 'BAU KAAM NI VASTU CHE'

    // console.log('bookedAdKeys\n', bookedAdKeys);

    // let vendorAds = firebase.database().ref('vendorAds/' + currentUser);
    // let bookedAdDetailsPromise = bookedAdKeys.map(id => {
    //   return vendorAds.child(id).once('value', s => s.val());
    // });

    // Promise.all(bookedAdDetailsPromise)
    //   .then(snapshot => console.log('bookedAdDetailsPromise\n', snapshot))
    //   .catch(error => console.error(error));

    //#endregion
  }

  static navigationOptions = {
    title: 'Bookings',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#D9AE3C',
      textAlign: 'center'
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    if (this.state.bookingDetails.length === 0) {
      return (
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              marginTop: 5
            }}
          >
            No bookings till now
          </Text>
        </View>
      );
    }
    return (
      <View style={vendorStyles.container}>
        <FlatList
          onRefresh={() => this.componentDidMount()}
          refreshing={this.state.loading}
          style={{ marginTop: 10 }}
          scrollsToTop={true}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
          data={this.state.bookingDetails}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('VendorBookingDetailsScreen', {
                    adData: item
                  })
                }
              >
                <Card style={{ width: Dimensions.get('screen').width - 10 }}>
                  <CardItem>
                    <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          flexWrap: 'wrap'
                        }}
                      >
                        {item.machineType}
                      </Text>
                      <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>Cost:</Text>
                        <Text>&#8377;{item.cost}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>
                          Booking Date:
                        </Text>
                        <Text>{item.bookingDate}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={{ fontWeight: 'bold' }}>From:</Text>
                        <Text>{item.fromDate}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={{ fontWeight: 'bold' }}>To:</Text>
                        <Text>{item.toDate}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={{ fontWeight: 'bold' }}>
                          Machine Use Hours:
                        </Text>
                        <Text>{item.hoursUsed}</Text>
                      </View>
                    </View>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.adKey.toString()}
        />
      </View>
    );
  }
}
