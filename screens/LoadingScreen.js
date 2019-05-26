import React from 'react';
import { StyleSheet,View, ActivityIndicator, Text } from 'react-native';
import * as firebase from 'firebase'

export default class LoadingScreen extends React.Component {
  static navigationOptions = {header: null}
  componentDidMount(){
      firebase.auth().onAuthStateChanged(user => {
          if(user)
            this.props.navigation.navigate("Profile")
          else
            this.props.navigation.navigate("SignIn")
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Please wait</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
