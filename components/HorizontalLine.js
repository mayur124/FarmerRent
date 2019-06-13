import React from 'react';
import { View, Dimensions } from 'react-native';

export default class HorizontalLine extends React.Component {
  render() {
    return (
      <View
        style={{
          borderBottomColor: '#9C9C9C',
          borderBottomWidth: 0.5,
          width: Dimensions.get('screen').width,
          margin: 5
        }}
      />
    );
  }
}
