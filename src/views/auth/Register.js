import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    ToastAndroid,
    Image

} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import GeoPermission from '../../utils/Geolocation'

const GeoPermissionService = new GeoPermission()
import { Textfield, Passwordfield } from '../components/TextField'
import { ButtonLime, ButtonDefault } from '../components/Button'


class Register extends Component {

    constructor() {
        super()
        this.state = {
            form: {
                email: '',
                name: '',
                password: ''
            },
            filetemp: {
                fileName: null,
                path: null,
            },
            loading: false,
            location: {}
        }
    }


    async componentDidMount() {
        if (await GeoPermissionService.checkPermision()) {
            GeoPermissionService.initGeolocation()
                .then((result) => {
                    this.setState({
                        location: result
                    })
                })
                .catch((err) => {
                    console.log("GeoPermissionService.initGeolocation", err)
                    return this.ToastShow("Please Enable you geolocation")
                })
        }
    }

    isLoadingEnable = (status) => {
        this.setState({
            loading: status
        })
    }

    chooseImage = () => {
        let options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    filetemp: {
                        fileName: response.fileName,
                        path: response.path
                    }
                });
            }
        });
    }

    handleChange = (name, value) => {
        let newState = { ...this.state.form }
        newState[name] = value
        this.setState({
            form: newState
        })
    }

    deleteCurrentUser = () => {
        var user = firebase.auth().currentUser;
        user.delete().then(function () {
            return this.alertToast("Error when trying create account, Please contact our developer")
        }).catch(function () {
            return this.alertToast("Error when trying create account, Please contact our developer")
        });
    }

    alertToast = (message) => {
        return ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50)
    }

    handleSubmit = async () => {
        await GeoPermissionService.checkPermision()
            .then((result) => {
                if (result) {
                    this.save()
                } else {
                    this.alertToast("Please Enable you geolocation")
                }
            }).catch((err) => {
                this.alertToast("Please Enable you geolocation")
            })
    }

    save = async () => {
        if ((this.state.form.email === "" || this.state.form.email === null || this.state.form.email === undefined) ||
            this.state.form.password === "" || this.state.form.password === null || this.state.form.password === undefined ||
            this.state.form.name === "" || this.state.form.name === null || this.state.form.name === undefined) {
            this.alertToast("Email, name and Password cant null")
            return
        }


        if (((this.state.filetemp.fileName == undefined || (this.state.filetemp.fileName == null) && (this.state.filetemp.path == undefined || this.state.filetemp.path == null)))) {
            return this.alertToast("Please, Upload you Avatar")
        }
        this.isLoadingEnable(true)

        //Upload Avatar
        await storage().ref("beechatt_avatar/" + this.state.filetemp.fileName).putFile(this.state.filetemp.path).then(() => {
            console.log("Uploading Avatar Success")
        }).catch((() => {
            return this.alertToast("Avatar Failed to Upload, Please try Again")
        }))

        // Create New Account
        await auth().createUserWithEmailAndPassword(this.state.form.email, this.state.form.password).then((result) => {
            //Make Sure if account created
            if (!auth().currentUser && auth().currentUser.uid === null && auth().currentUser.uid === undefined) {
                this.deleteCurrentUser()
                return
            }

            //Get URL from File after upload
            storage().ref(`beechatt_avatar/${this.state.filetemp.fileName}`).getDownloadURL().then((url) => {
                //create Public User
                const position = this.state.location
                firestore().collection('Users').doc(auth().currentUser.uid).set({
                    name: this.state.form.name,
                    avatar: url,
                    isOnline: true,
                    position: {
                        long: position.coords.longitude,
                        lat: position.coords.latitude
                    }
                }).then(() => {
                    //Update for add Secret User
                    result.user.updateProfile({
                        displayName: this.state.form.name,
                        photoURL: url
                    })
                }).catch((err) => {
                    console.warn("Firestore Create User Error", err)
                    this.deleteCurrentUser()
                })

            }).catch((error) => {
                console.warn("Firestore Create User Error", err)
                this.deleteCurrentUser()
            })
            //stop loading and go to homepage
            this.isLoadingEnable(false)
            this.props.navigation.replace("homepage")

        }).catch(error => {
            this.isLoadingEnable(false)
            return this.alertToast(error.message)
        });
        this.isLoadingEnable(false)
    }

    render() {
        const { path } = this.state.filetemp
        const { loading } = this.state
        return (
            <ScrollView style={styles.wrap}>
                <View>
                    <Text style={styles.title}>Register New Account</Text>
                    <View style={styles.frame}>
                        <TouchableOpacity onPress={this.chooseImage}  >
                            {
                                (path === null || path === undefined) ?
                                    <View style={styles.avatar}>
                                        <Text style={styles.uploadLabel}>  <Icon name='upload' size={29} color='green' /></Text>
                                        <Text style={styles.uploadLabel}> Upload Avatar</Text>
                                    </View> :
                                    <Image
                                        style={styles.avatar}
                                        source={{
                                            uri: "file://" + this.state.filetemp.path,
                                        }}
                                    />
                            }
                        </TouchableOpacity>
                    </View>
                    <Textfield
                        placeholder='Fullname'
                        onChange={(e) => this.handleChange('name', e)}
                        value={this.state.form.name}
                    />

                    <Textfield
                        placeholder='Email'
                        onChange={(e) => this.handleChange('email', e)}
                        value={this.state.form.email} />

                    <Passwordfield
                        placeholder='Password'
                        onChange={(e) => this.handleChange('password', e)}
                        value={this.state.form.password} />

                    <ButtonLime
                        onPress={this.handleSubmit}
                        label={!loading ? 'Sign Up' : 'Loading ...'}
                    />
                    <ButtonDefault
                        onPress={() => this.props.navigation.replace('login')}
                        label='Already Accont'
                    />
                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({

    wrap: {
        flex: 1,
        padding: 20,
    },

    frame: {
        alignItems: 'center',
        marginBottom: 10,
        padding: 20,

    },
    avatar: {
        borderRadius: 10,
        height: 120,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#33cc33'
    },
    uploadLabel: {
        fontWeight: 'bold',
        fontFamily: 'lucida grande, tahoma, verdana, arial, sans-serif',
        alignItems: 'center',
        textAlign: 'center'
    },

    title: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'sans-serif'
    },




})


export default Register;