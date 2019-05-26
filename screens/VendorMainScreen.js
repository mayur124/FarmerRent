import React from 'react';
import { StyleSheet,View, Text } from 'react-native';

export default class VendorMainScreen extends React.Component {
  static navigationOptions = {header: null}

  render() {
    return (
      <View style={styles.container}>
        <Text>VendorMainScreen</Text>
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
