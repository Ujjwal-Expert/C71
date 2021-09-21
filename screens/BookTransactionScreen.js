import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet,TextInput,Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';
import db from '../config.js'

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedData:'',
        scannedBookID:'',
        scannedStudentID: '',
        buttonState:'normal'
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      this.setState({
        scanned: true,
        scannedData: data,
        buttonState: 'normal'
      });
    }

    handleTransaction = async()=>{
      var transactionMessage;
      db.collection('Books').doc(this.state.scannedBookID).get()
      .then(d)
      =>{
        var book = doc.data()

        if(book.bookAvailability){
            this.initiateBookIssue();
            transactionMessage = "Book Issued";

        }

        else{
          this.initiateBookReturn();
        transactionMessage="Book Returned";        }
      } 

      this.setState({
      transactionMessage:transactionMessage
      })   
    }

initiateBookReturn = async()=>{

  //add a transaction
       db.collection("Transaction").add({
         'studentId':this.state.scannedStudentID,
         'bookId':this.state.scannedBookID,
         'date':firebase.firestore.Timestamp.now().toDate(),
          'transactionType':"Return"
         
       })

  //change book status
  
  db.collection('Books').doc(this.state.scannedBookID).update({
    'bookAvailability':true
  })

  //change number of issued book for student

  db.collection('Students').doc(this.state.scannedStudentID).update({
    'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
  })

Alert.alert("Book Returned")

this.setState(
  {
    scannedBookID:'',
    scannedStudentID:''
  }
)
     }
     
     render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;
      
      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
            <View>
              <Image sytle={{width:150,height:150}} source={require('../assets/booklogo.jpg')}/>
              <Text style={styles.wileyStyle}>Wily</Text>
            </View>

            <View style={styles.inputView}>
            <TextInput
              style = {styles.inputBox}
              placeholder="BookId"
              value = {this.state.scannedBookID} />

         <TouchableOpacity onPress={()=>{this.getCameraPermissions("BookID")}} style={styles.scanButtonInput}>
            <Text style = {styles.buttonText}>SCAN</Text>

              </TouchableOpacity>
             </View>
             <View style={styles.inputView}>
            <TextInput
              style = {styles.inputBox}
              placeholder="StudentId"
              value = {this.state.scannedStudentID}/>

            <TouchableOpacity onPress={()=>{this.getCameraPermissions("StudentID")}} style={styles.scanButtonInput}>
            <Text style = {styles.buttonText}>SCAN</Text>

              </TouchableOpacity>
             </View>
          <Text style={styles.displayText}>{
            hasCameraPermissions===true ? this.state.scannedData: "Request Camera Permission"
          }</Text>     

          <TouchableOpacity
            onPress={this.getCameraPermissions}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={async()=>{this.handleTransaction()}}>
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
      textAlign: 'center',
      marginTop: 10
    },

    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      fontSize: 20

    },
    scanButtonInput:{
        backgroundColor: "#874412",
        width: 50,
        borderWidth: 1.5

    },
    wileyStyle:{
      fontSize:30,
      alignSelf:'center',
      color:'#a412b3'
    },
    submitButton:{
      width:100,
      height:50,
      backgroundColor:'#113333'
    }
  });