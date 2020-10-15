import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Math.round(Dimensions.get('window').width);
function App() {
  const navigation = useNavigation()
  const [users, SetUsers] = useState([])
  const [MyUid, setMyUid] = useState(null)

  useEffect(() => {
    if (auth().currentUser && auth().currentUser.uid !== null && auth().currentUser.uid !== undefined) {
      setMyUid(auth().currentUser.uid)
      firestore().collection('Users').get().then(snaphot => {
          const currentData = []
          snaphot.forEach(doc => {
            Object.assign(doc.data(), { id: doc.id })
            currentData.push(doc.data())
          });
          SetUsers(currentData);
        });
    }
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.body}>
        {
          users !== undefined && users !== null ? users.filter(user => user.id !== MyUid).map((user) => (
            <View>
              <View>
                <TouchableOpacity onPress={() => { navigation.navigate('roomchatt',{id: user.id,name: user.name})}} >
                  <View style={styles.box}>
                    <Image style={styles.image} source={{ uri:user.avatar}} />
                    <View>
                      <Text style={styles.username}>{user.name}</Text>
                      <Text style={styles.online}>{user.isOnline && 'Online'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )) : <Text style={styles.username}>Kosong</Text>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 50,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#003366',
    color: '#fff'
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 10
  },
  body: {
    width: screenWidth,
  },

  box: {
    borderTopColor: '#ccc',
    padding: 10,
    borderTopWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    shadowColor: 'black',
  },
  username: {
    color: "#fff",
    fontSize: 40,
    alignSelf: 'center',
  },
  online: {
    color: '#00FF00'
  }

})

export default App