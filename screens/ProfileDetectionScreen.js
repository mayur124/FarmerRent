import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import * as firebase from 'firebase'

export default class ProfileDetectionScreen extends React.Component {
  _isMounted = false;

  constructor(props){
    super(props)
    this.state={
      displayName: "",
      email: "",
    }
  }

  static navigationOptions = {
    title: "Profile",
    header: null
  }

  componentDidMount(){
   
    this._isMounted=true
    firebase.auth().onAuthStateChanged(authenticate => {
      if(authenticate){
        if(this._isMounted){
          this.setState({
            displayName: authenticate.displayName,
            email: authenticate.email,
          })
        }
      } else {
        this.props.navigation.navigate("SignIn")
      }
    })
    
    //#region practice firebase query -- not working but understood querying in firebase
    // const dbRef = firebase.database().ref()
    // const {email} = this.state
    // console.log("state object \n",this.state);
    // dbRef.child('users')
    //       .once('value', snapshot => {
    //         console.log("snapshot: \n",snapshot.key);
    //         dbRef.child(snapshot.key)
    //         .once('value', snapshot2 => {
    //           console.log("\nsnapshot2:\n",Object.keys(snapshot2.val()));
    //           Object.keys(snapshot2.val()).map(userType => {
    //             dbRef.child('users/'+userType)
    //             .once('value', snapshot3 => {
    //               console.log(Object.keys(snapshot3.val()))
    //               let firebaseUsernameArray = Object.keys(snapshot3.val());
    //               let firebaseUsername = firebaseUsernameArray.filter(username => {
    //                 dbRef.child('users/'+userType+'/'+username)
    //                 .once('value',snapshot4 => {
    //                   let tempUname = snapshot4.val().username
    //                   console.log("stateEmail: ",email);
    //                   console.log(tempUname.toLowerCase() === email);
    //                   return tempUname.toLowerCase() === email
    //                 })
    //               })
    //               console.log("FirebaseUsername: " ,firebaseUsername);
    //             })
    //           })
    //         })
    //       })

    //#endregion

    const dbRef = firebase.database().ref('users')
    dbRef.once('value',snapshot=>{
      if(snapshot){
        //#region stackoverflow iteration of firebase snapshot
        // snapshot.forEach(objSnapshot => {
        //   console.log(objSnapshot); // will return entire data
        //   objSnapshot.forEach(snapshot => {
        //     //console.log(snapshot.val().username)
        //     let firebaseUsername = snapshot.val().username.toLowerCase()
        //     let stateEmail = this.state.email
        //     if(stateEmail===firebaseUsername){
        //       console.log(snapshot.val().userType);
        //       if(snapshot.val().userType === 'farmer'){
        //         console.log("inside firebase userType: farmer");
        //         // this.props.navigation.navigate("FarmerProfile")
        //         // return
        //       }
        //       else if(snapshot.val().userType === 'vendor'){
        //         console.log("inside firebase userType: vendors");
        //         // this.props.navigation.navigate("VendorProfile")
        //         // return
        //       }
        //     }
        //   })
        // })
        //#endregion

        // console.log("email: ", this.state.email);
        
        let rootObject = snapshot.val();
        let userTypesNode = Object.keys(rootObject);
        // console.log(userTypesNode);
        for(let i=0; i<userTypesNode.length; i++){
          let userType = userTypesNode[i]
          // console.log(userType+": "+Object.keys(rootObject[userType]));
          let userSubData = Object.keys(rootObject[userType])
          // console.log(userId);
          for(let j=0; j<userSubData.length; j++){
            let userId = userSubData[j]
            // console.log(rootObject[userType][userId]);
            let firebaseUsername = rootObject[userType][userId]["username"].toLowerCase()
            let firebaseUserType = rootObject[userType][userId]["userType"]
            // console.log(firebaseUsername);
            let stateEmail = this.state.email
            // console.log("stateEmail: ",stateEmail);
            // console.log("firebaseUsername: ",firebaseUsername);
            if(firebaseUsername === stateEmail){
              // console.log("inside if block");
              
              if(firebaseUserType === 'farmer'){
                // console.log("inside firebase userType: farmer");
                this.props.navigation.navigate("FarmerProfile")
                return
              }
              if(firebaseUserType === 'vendor'){
                // console.log("inside firebase userType: vendor");
                this.props.navigation.navigate("VendorProfile")
                return
              }
            } 
          }
        }
      }
    })
  }

  componentWillUnmount(){
    this._isMounted = false
  }

  render() {
      return(
        <View style={styles.container}>
          <ActivityIndicator size="large" />
          <Text>Just a moment</Text>
        </View>
      )
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
