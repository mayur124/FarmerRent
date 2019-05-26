import React from 'react'

export default class UserType extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userType: ""
        }
    }

    static setUserType = userType => {
        this.setState({userType: userType})
    }
}