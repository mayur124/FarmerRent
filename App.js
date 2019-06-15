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
import FarmerMachineDetail from './screens/Farmers/FarmerMachineDetail';
import FarmerAllMachines from './screens/Farmers/FarmerAllMachines';
import FarmerSearchMachines_StCtyPn from './screens/Farmers/FarmerSearchMachines_StCtyPn';
import FarmerSearchMachines_McTyp from './screens/Farmers/FarmerSearchMachines_McTyp';
import FarmerTransactionHistoryScreen from './screens/Farmers/FarmerTransactionHistoryScreen';

import VendorEquipmentScreen from './screens/Vendors/VendorEquipmentScreen';
import VendorBookingsScreen from './screens/Vendors/VendorBookingsScreen';
import VendorEarningScreen from './screens/Vendors/VendorEarningScreen';
import VendorProfileScreen from './screens/Vendors/VendorProfileScreen';
import VendorMachineScreen from './screens/Vendors/VendorMachinesScreen';
import VendorMachineDetail from './screens/Vendors/VendorMachineDetail';

//Vendor Form pages
import VendorListMachineScreen from './screens/Vendors/VendorListMachineScreen_F';
import VendorMachineDescriptionScreen from './screens/Vendors/VendorMachineDescription_F';
import VendorMachinePricingScreen from './screens/Vendors/VendorMachinePricingScreen_F';

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

const FarmerHomeNavigator = createStackNavigator(
  {
    Home: { screen: FarmerHomeScreen },
    SearchStCtyPn: { screen: FarmerSearchMachines_StCtyPn },
    SearchMchn: { screen: FarmerSearchMachines_McTyp },
    FarmerMachineDetail: { screen: FarmerMachineDetail },
    FarmerAllMachines: { screen: FarmerAllMachines }
  },
  {
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name='home' color={tintColor} size={24} />
      )
    }
  }
);

const FarmerNavigator = createMaterialBottomTabNavigator(
  {
    FarmerHomeNavigator,
    History: { screen: FarmerTransactionHistoryScreen },
    Profile: { screen: FarmerProfileScreen }
  },
  {
    activeTintColor: '#F6F2EE',
    shifting: false,
    barStyle: { backgroundColor: '#A18F78' }
  }
);

const VendorAddMachine = createStackNavigator(
  {
    Equipments: { screen: VendorEquipmentScreen },
    ListMachine: { screen: VendorListMachineScreen },
    MachineDescription: { screen: VendorMachineDescriptionScreen },
    MachinePricing: { screen: VendorMachinePricingScreen },
    VendorMachines: { screen: VendorMachineScreen },
    MachineDetail: { screen: VendorMachineDetail }
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

const profileNavigator = createStackNavigator(
  {
    ProfileScreen: { screen: VendorProfileScreen }
  },
  {
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name='user-circle' color={tintColor} size={24} />
      )
    }
  }
);

const BookingNavigator = createStackNavigator(
  {
    BookingScreen: { screen: VendorBookingsScreen }
  },
  {
    navigationOptions: {
      tabBarLabel: 'Bookings',
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name='calendar' color={tintColor} size={24} />
      )
    }
  }
);

const EarningNavigator = createStackNavigator(
  {
    EarningScreen: { screen: VendorEarningScreen }
  },
  {
    navigationOptions: {
      tabBarLabel: 'Earnings',
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name='line-chart' color={tintColor} size={24} />
      )
    }
  }
);

const VendorNavigator = createMaterialBottomTabNavigator(
  {
    VendorAddMachine,
    BookingNavigator,
    EarningNavigator,
    profileNavigator
  },
  {
    activeTintColor: '#D9AE3C',
    shifting: false,
    barStyle: { backgroundColor: '#453421' }
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
