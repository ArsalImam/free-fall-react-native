import React, {Component} from 'react';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {StyleSheet, Text, View, FlatList, Alert} from 'react-native';
import getAcceleration from './src/getAcceleration';
import moment from './moment';
import * as firebase from 'firebase';

// interval ////
setUpdateIntervalForType(SensorTypes.accelerometer, 800); // defaults to 100ms

// firebase configurations ////
var firebaseConfig = {
  apiKey: 'AIzaSyBRMBiS78q0KwW1239Zhf-b9brZZaWjN6I',
  authDomain: 'falldetectiontest-2a947.firebaseapp.com',
  databaseURL: 'https://falldetectiontest-2a947.firebaseio.com',
  projectId: 'falldetectiontest-2a947',
  storageBucket: 'falldetectiontest-2a947.appspot.com',
  messagingSenderId: '1017162966917',
  appId: '1:1017162966917:web:49433006d6e9a5b0ec46ec',
};
// Initialize Firebase ////
firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  state = {
    newDate: [],
    Date: '',
  };

  componentDidMount() {
    // saving & retrieving items from firebase ////
    firebase
      .database()
      .ref()
      .child('detection')
      .on('child_added', snapshot => {
        const data = snapshot.val();
        // console.warn('----', data);
        if (snapshot.val()) {
          this.setState(prevState => ({
            newDate: [data, ...prevState.newDate],
          }));
        }
      });

    // get acceleration ////
    accelerometer.subscribe(({x, y, z, timestamp}) => {
      const value = getAcceleration(x, y, z);

      // setting up the threshold for free fall detection ////
      if (value < 3 && value > 0) {
        const date = moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
        const getValue = firebase
          .database()
          .ref()
          .child('detection')
          .push();
        getValue.set(date);
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text> FALL DETECTION </Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.newDate}
          renderItem={({item}) => {
            return (
              <View style={styles.listItemContainer}>
                <Text style={styles.listItem}> Fall Detection :{item}</Text>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  listItemContainer: {
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 5,
  },
  listItem: {
    fontSize: 10,
    padding: 10,
  },
  heading: {
    fontSize: 30,
    padding: 10,
    backgroundColor: '#FDFD96',
  },
});
