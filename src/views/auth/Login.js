import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
} from 'react-native'
import { Textfield, Passwordfield } from '../components/TextField'
import { ButtonLime, ButtonDefault } from '../components/Button'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import GeoPermission from '../../utils/Geolocation'
import Online from '../../utils/OnlineStatus'
const GeoPermissionService = new GeoPermission()
const onlineService = new Online()

class Login extends React.Component {

  constructor() {
    super()
    this.state = {
      form: {
        email: '',
        password: ''
      },
      authenticated: false,
      loading: false,
      position: {},
    }
  }

  HandleChange = (name, value) => {
    let newState = { ...this.state.form }
    newState[name] = value
    this.setState({
      form: newState
    })
  }

  ToastShow = (message) => {
    return ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50)
  }

  SetLoading(status) {
    this.setState({ loading: status })
  }

  handleSubmit = async () => {
    if ((this.state.form.email === "" || this.state.form.email === null || this.state.form.email === undefined) ||
      this.state.form.password === "" || this.state.form.password === null || this.state.form.password === undefined) {
      this.ToastShow("Email and Password cant null")
      return
    }
    await GeoPermissionService.checkPermision().then((result) => {
      const { position } = this.state
      if (result) {
        this.SetLoading(true)
        auth().signInWithEmailAndPassword(this.state.form.email, this.state.form.password).then(() => {
          firestore().collection('Users').doc(auth().currentUser.uid).update({
            position: { long: position.coords.longitude, lat: position.coords.latitude }
          })
          onlineService.setStatusOnline()
          this.props.navigation.replace("homepage")
        }).catch(error => {
          if (error) {
            this.SetLoading(false)
            this.ToastShow(
              error.message &&
                error.message.split("]") &&
                error.message.split("]")[1] ?
                error.message.split("]")[1] :
                error.message)
          }
        })
      }
    }).catch(() => {
      this.ToastShow("Please, Enable Geolocation")
      this.SetLoading(false)
    })
  }

  async componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authenticated: true })
      }
    })
    if (await GeoPermissionService.checkPermision()) {
      GeoPermissionService.initGeolocation()
        .then((result) => {
          this.setState({
            position: result
          })
        })
        .catch((err) => {
          console.log("GeoPermissionService.initGeolocation", err)
          return this.ToastShow("Please Enable you geolocation")
        })
    }
  }

  render() {
    if (this.state.authenticated) {
      this.props.navigation.replace("homepage")
    }
    const { loading } = this.state
    return (
      <View style={styles.Wrap}>
        <View style={styles.Header}>
          <Text style={styles.HeaderTitle}>Hello, Welcome Back</Text>
        </View>
        <View style={styles.Content}>
          <Textfield
            placeholder='Email'
            onChange={(e) => this.HandleChange('email', e)}
            value={this.state.form.email}
            keyboardType={'email-address'} />
          <Passwordfield
            placeholder='Password'
            onChange={(e) => this.HandleChange('password', e)}
            value={this.state.form.password} />
        </View>
        <View style={styles.Footer}>

          <ButtonLime
            disabled={!loading ? false : true}
            onPress={this.handleSubmit}
            label={!loading ? 'Login' : 'Loading ...'}
          />

          <ButtonDefault
            onPress={() => this.props.navigation.replace('register')}
            label='Create new Account'
          />

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Wrap: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  },
  Header: {
    padding: 20,
    borderRadius: 10,
  },
  HeaderTitle: {
    fontSize: 40,
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'verdana, arial, sans-serif'
  },
  Content: {
    padding: 20,

  },
  Footer: {
    padding: 20,
  },
})


export default Login