import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

import * as firebase from 'firebase';
import LoadingScreen from './screens/LoadingScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileDetectionScreen from './screens/ProfileDetectionScreen';

import FarmerHomeScreen from './screens/Farmers/FarmerHomeScreen';

import FarmerProfileScreen from './screens/Farmers/FarmerProfileScreen';
import FarmerTransactionHistoryScreen from './screens/Farmers/FarmerTransactionHistoryScreen';

import VendorEquipmentScreen from './screens/Vendors/VendorEquipmentScreen';
import VendorBookingsScreen from './screens/Vendors/VendorBookingsScreen';
import VendorEarningScreen from './screens/Vendors/VendorEarningScreen';
import VendorProfileScreen from './screens/Vendors/VendorProfileScreen';

//Vendor Form pages
import VendorListMachineScreen from './screens/Vendors/VendorListMachineScreen_F';
import VendorMachineDescriptionScreen from './screens/Vendors/VendorMachineDescription_F';
import VendorMachinePricingScreen from './screens/Vendors/VendorMachinePricingScreen_F';
import MyCamera from './screens/Vendors/Camera';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDGEhpCAPrGhjc5-VdEigFTc682KUmrv8w',
  authDomain: 'summerproject-43a50.firebaseapp.com',
  databaseURL: 'https://summerproject-43a50.firebaseio.com',
  projectId: 'summerproject-43a50',
  storageBucket: 'summerproject-43a50.appspot.com',
  messagingSenderId: '600953949285',
  appId: '1:600953949285:web:01080b7fcb70fbf5'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const FarmerNavigator = createMaterialBottomTabNavigator({
  Home: { screen: FarmerHomeScreen },
  History: { screen: FarmerTransactionHistoryScreen },
  Profile: { screen: FarmerProfileScreen }
});

const VendorAddMachine = createStackNavigator(
  {
    Equipments: { screen: VendorEquipmentScreen },
    ListMachine: { screen: VendorListMachineScreen },
    MachineDescription: { screen: VendorMachineDescriptionScreen },
    MachinePricing: { screen: VendorMachinePricingScreen },
    MyCamera: { screen: MyCamera }
  },
  {
    initialRouteName: 'Equipments',
    navigationOptions: {
      tabBarLabel: 'Equipments',
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name='truck' color={tintColor} size={24} />
      )
    }
  }
);

const VendorNavigator = createMaterialBottomTabNavigator(
  {
    VendorAddMachine,
    Bookings: {
      screen: VendorBookingsScreen,
      navigationOptions: {
        tabBarLabel: 'Bookings',
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name='calendar' color={tintColor} size={24} />
        )
      }
    },
    Earnings: {
      screen: VendorEarningScreen,
      navigationOptions: {
        tabBarLabel: 'Earnings',
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name='line-chart' color={tintColor} size={24} />
        )
      }
    },
    Profile: {
      screen: VendorProfileScreen,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name='user-circle' color={tintColor} size={24} />
        )
      }
    }
  },
  {
    // initialRouteName: 'Equipments',
    activeTintColor: '#453421'
  }
);

const MainNavigator = createSwitchNavigator(
  {
    Loading: { screen: LoadingScreen },
    SignIn: { screen: SignInScreen },
    SignUp: { screen: SignUpScreen },
    Profile: { screen: ProfileDetectionScreen },
    FarmerProfile: { screen: FarmerNavigator },
    VendorProfile: { screen: VendorNavigator }
  },
  {
    initialRouteName: 'Loading'
  }
);

const App = createAppContainer(MainNavigator);

export default App;
