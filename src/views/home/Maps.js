import React, { Component, } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 2.0;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends Component {

  state = {
    myaccount: {
      id: '',
      name: '',
      avatar: '',
      position: {
        latitude: 0,
        longitude: 0,
      }
    },
    users: []
  }


  componentDidMount() {
    if (auth().currentUser && auth().currentUser.uid !== null && auth().currentUser.uid !== undefined) {
      let userFirestore = firestore().collection('Users').doc(auth().currentUser.uid);
      userFirestore.onSnapshot({ includeMetadataChanges: true }, (result) => {
        this.setState({
          myaccount: {
            id: result.data().uid,
            name: result.data().name,
            avatar: result.data().avatar,
            position: {
              latitude: parseFloat(result.data().position.lat),
              longitude: parseFloat(result.data().position.long),
              latitudeDelta: 0.2,
              longitudeDelta: 0.3,
            }
          }
        })
      })
    }

    let docusers = firestore().collection('Users')
    docusers.onSnapshot((snaphot => {
      const users = []
      snaphot.forEach(doc => {
        Object.assign(doc.data(), { id: doc.id })
        users.push(doc.data())
      });
      this.setState({
        users
      })
    }))
  }

  render() {
    const { latitude, longitude } = this.state.myaccount.position
    const { name, avatar } = this.state.myaccount
    const { users } = this.state
    return (
      <MapView
        style={styles.wrap}
        followsUserLocation={true}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >

        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title={name}
          description="You are here"

        >
          <View style={styles.Marker}>
            <Image style={styles.MarkerAvatar} source={{ uri: avatar }} />
            <View style={styles.MarkerText}></View>
          </View>
        </Marker>

        {
          users === undefined ? '' : users.map(item =>
            item.id !== auth().currentUser.uid &&
            <Marker
              coordinate={{
                latitude: item.position.lat,
                longitude: item.position.long,
              }}
              title={item.name}
              description="You Frriend"
              pinColor={'blue'}
            >

              <View style={styles.Marker}>
                <Image style={styles.MarkerAvatar} source={{ uri: item.avatar }} />
                <View style={styles.MarkerText}></View>
              </View>

            </Marker>
          )
        }
      </MapView >
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 50,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#003366',
    color: '#fff'
  },
  Marker: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -10,

  },
  MarkerText: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 20,
    borderLeftWidth: 20,
    borderTopWidth: 50,
    borderTopColor: 'purple',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    zIndex: 1,
    borderRadius: 50,


  },
  MarkerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: 'purple',
    borderWidth: 2,
    zIndex: 2,
    top: 15
  }
})