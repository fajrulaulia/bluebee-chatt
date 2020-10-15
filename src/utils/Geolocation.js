import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';


export default class App {

  constructor() {
    this.whachID
  }

  async initGeolocation(cb) {

    return new Promise((resolve, reject) => [
      Geolocation.getCurrentPosition((position, err) => {
        if (err) {
          reject(err)
        } else {
          resolve(position)
        }

      })
    ])

  }


  async setLocationOnDB(loc) {
    let id = auth().currentUser.uid
    const position = {
      long: loc.coords.longitude,
      lat: loc.coords.latitude
    }
    await firestore().collection('Users').doc(id).update({ position })
      .catch((err) => console.log("firestore().collection", err))
  }

  async setLocation() {
    const GeoOption = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 10000,
      useSignificantChanges: true
    }
    this.whachID = await Geolocation.watchPosition(position => this.setLocationOnDB(position), (err) => console.log(err), GeoOption);
  }

  checkPermision() {
    return new Promise((resolve, reject) => {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
        if (result === RESULTS.GRANTED) {
          resolve(true)
        } else {
          reject(false)
        }
      }).catch((error) => {
        console.log(error);
        reject(false)
      });
    })
  }

  StopWatch() {
    Geolocation.clearWatch(this.whachID)
  }
}