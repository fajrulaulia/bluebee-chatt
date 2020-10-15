import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import online from '../../utils/OnlineStatus'
import Geolocation from '../../utils/Geolocation'


const onlineService = new online()
const GeolocationService = new Geolocation()

function App() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({});
  const [avatar, setAvatar] = useState("");

  authRemove =  () => {
    GeolocationService.setLocation(true)
    onlineService.setStatusOffline()
    auth().signOut()
      .then(() => navigation.navigate("login"))
      .catch(() => navigation.navigate("login"));
  }

  logout = () => {
    Alert.alert("Confirmation", "Are you sure to logout?", [{
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel"
    },
    {
      text: "OK", onPress: () => {
        onlineService.setStatusOffline()
        authRemove()
      }
    }
    ],
      { cancelable: false }
    );
  }

  useEffect(() => {
    if (!(auth().currentUser === undefined && auth().currentUser === null)) {
      setProfile(auth().currentUser)
      setAvatar(auth().currentUser.photoURL)
    }
  })

  return (
    <SafeAreaView style={styles.wrap}>
      <View style={styles.frame}>

        {(avatar === undefined || avatar === null|| avatar === "") ?
          <View style={styles.avatar}></View> :
          <Image
            style={styles.avatar}
            source={{
              uri: avatar,
            }}
          />
        }


      </View>

      <View style={styles.profileLabelWrap}>
        <View>
          <Text style={styles.usernameLabel}>{profile.displayName}</Text>
        </View>
      </View>
      <View style={styles.usernameWrap}>
        <View>
          <Text style={styles.emailLabel}>{profile.email}</Text>
        </View>
      </View>

      <View style={styles.logout}>
        <TouchableOpacity style={styles.redirectButton}
          onPress={() => logout()}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  wrap: {
    paddingTop: 50,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#003366'

  },
  frame: {
    alignItems: 'center',
    width: 500,
    backgroundColor: '#003366',
  },
  avatar: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: '#FFF',
    borderWidth: 1,
    marginBottom: 50,
  },
  profileLabelWrap: {
    alignItems: 'center',
    margin: 20,
    padding: 5,
    width: '100%',
    height: 50,
    borderRadius: 10,

  },
  usernameLabel: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    width: '100%',
    height: 50,
    borderRadius: 10,
  },
  emailLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    width: '100%',
    height: 50,
    borderRadius: 10,
  },
  logout: {
    margin: 20,
    width: '80%',
    height: 50,
    position: 'absolute',
    bottom: -0,
  },

  redirectButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#3399FF'
  },

  buttonText: {
    textAlign: 'center',
    color: '#e7eff6',
    fontWeight: 'bold',
    fontSize: 20,
  },

})


export default App