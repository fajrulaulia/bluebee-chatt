import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';

export default class online {
    setStatusOnline() {
        if (auth().currentUser && auth().currentUser.uid !== undefined && auth().currentUser.uid !== null) {
            firestore()
                .collection('Users')
                .doc(auth().currentUser.uid)
                .update({
                    isOnline: true,
                })
                .then(() => {
                    console.log(`${auth().currentUser.uid} User Online`);
                }).catch((err) => {
                    console.warn("Firestore.Update() ", err)
                })
            return true
        }
        return false
    }

    setStatusOffline() {
        if (auth().currentUser && auth().currentUser.uid !== null && auth().currentUser.uid !== undefined) {
            firestore()
                .collection('Users')
                .doc(auth().currentUser.uid)
                .update({
                    isOnline: false,
                })
                .then(() => {
                    console.log(`${auth().currentUser.uid} User Offline`);
                }).catch((err) => {
                    console.warn("Firestore.Update() ", err)
                })
            return true
        }
        return false
    }
}


