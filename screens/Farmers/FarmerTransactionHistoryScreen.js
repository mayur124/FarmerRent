import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import HorizontalLine from '../../components/HorizontalLine';
import { Card, CardItem, Button } from 'native-base';
import { styles, vendorStyles } from '../../components/Styles';
import * as firebase from 'firebase';

export default class FarmerTransactionHistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookedMachines: [],
      loading: false
    };
  }

  async componentDidMount() {
    await this.setState({ loading: true });
    let currentUser = firebase.auth().currentUser.email;
    currentUser = currentUser.replace(new RegExp('\\.', 'g'), '_');
    const dbRef = firebase.database().ref('farmerBookings/' + currentUser);
    await dbRef.once('value', async snapshot => {
      if (snapshot.val()) {
        let bookingKey = Object.keys(snapshot.val());
        let bookingValue = Object.values(snapshot.val());
        // console.log('bookingKey', bookingKey, 'bookingValue', bookingValue);
        await bookingKey.map((item, index) => {
          bookingValue[index]['bookingKey'] = item;
        });
        await console.log('bookingValue\n', ...bookingValue);
        await this.setState({ bookedMachines: bookingValue });
        await console.log(
          'this.state.bookedMachines\n',
          this.state.bookedMachines
        );
      }
    });

    await this.setState({ loading: false });

    const refreshDbRef = firebase.database().ref('farmerBookings');
    refreshDbRef.child(currentUser).on('child_added', () => this.forceUpdate());
  }

  static navigationOptions = {
    title: 'History',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#A18F78',
      textAlign: 'center'
    }
  };

  fetchBookings = async () => {
    this.componentDidMount();
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    if (this.state.bookedMachines.length === 0) {
      return (
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              marginTop: 5
            }}
          >
            No machines booked
          </Text>
        </View>
      );
    }
    return (
      <View style={vendorStyles.container}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            marginTop: 5
          }}
        >
          Booked machines
        </Text>
        <FlatList
          onRefresh={() => this.fetchBookings()}
          refreshing={this.state.loading}
          style={{ marginTop: 10 }}
          scrollsToTop={true}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
          data={this.state.bookedMachines}
          renderItem={({ item }) => {
            return (
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
                      <Text style={{ fontWeight: 'bold' }}>Booking Date:</Text>
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
                    {new Date(item.fromDate) > new Date() ? (
                      <TouchableOpacity>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: '#CE3C3E',
                            marginTop: 5
                          }}
                        >
                          Cancel Booking
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View />
                    )}
                  </View>
                </CardItem>
              </Card>
            );
          }}
          keyExtractor={item => item.adKey.toString()}
        />
      </View>
    );
  }
}
