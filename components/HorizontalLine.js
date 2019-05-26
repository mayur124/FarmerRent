import React from 'react'
import {View, Dimensions} from 'react-native'

export default class HorizontalLine extends React.Component{
    render(){
        return(
            <View style={{
                borderBottomColor: "#DAE0E2",
                borderBottomWidth: 1,
                width: Dimensions.get('screen').width, 
                margin: 5}} 
            />
        )
    }
}