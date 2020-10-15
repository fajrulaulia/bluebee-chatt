import React, { Component } from 'react'
import { Fragment, View, StyleSheet, AsyncStorage } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import app from '@react-native-firebase/app'

import auth from '@react-native-firebase/auth'

import { GiftedChat } from 'react-native-gifted-chat'

export default class Chatt extends Component {


  state = {
    name: '',
    uid: '',
    status: false,
    avatar: '',


    myuid: '',
    myname: '',
    myavatar: '',

    text: '',
    messages: [],

  }


  async componentDidMount() {
    let userFirestore = firestore().collection('Users').doc(this.props.route.params.id).get();

    await userFirestore.then((result) => {
      this.setState({
        name: result.data().name,
        uid: this.props.route.params.id,
        status: result.data().isOnline,
        avatar: result.data().avatar,

        myuid: auth().currentUser.uid,
        myname: auth().currentUser.displayName,
        myavatar: auth().currentUser.photoURL,
      })
    }).catch((err) => {
      console.log("Err", err)
    })


    let messagesFirestore = firestore().collection(`Messages/${this.state.myuid}/${this.state.uid}`).orderBy('createdAt', 'desc')
    await messagesFirestore.onSnapshot((snaphot) => {
      const currentData = []
      snaphot.forEach(doc => {
        currentData.push({
          _id: doc.data()._id,
          text: doc.data().text,
          createdAt: doc.data().createdAt.toDate().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
          user: {
            _id: doc.data().user._id === this.state.uid ? this.state.uid : this.state.myuid,
            name: this.state.name,
            avatar: this.state.avatar
          }
        })
      });
      this.setState({
        messages: currentData
      })
    });

  }

  sendMessage = () => {
    if (this.state.text.length > 0) {
      let message = {
        _id: Math.round(Math.random() * 1000000),
        text: this.state.text,
        createdAt: new Date(),
        user: {
          _id: this.state.uid,
          name: this.state.name,
          avatar: this.state.avatar
        }
      }
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))

      firestore().collection('Messages').doc(this.state.uid).collection(this.state.myuid).add(message).then(() => {
        firestore().collection('Messages').doc(this.state.myuid).collection(this.state.uid).add(message).then(() => {
          this.setState({ text: '' })
        });
      });

    }
  }

  render() {
    const { messages } = this.state
    return (
      <>
        <GiftedChat
          text={this.state.text}
          messages={messages}
          onSend={this.sendMessage}
          showAvatarForEveryMessage={true}
          user={{
            _id: this.state.uid
          }}
          onInputTextChanged={(value) => this.setState({ text: value })}
        />
      </>
    )
  }
}

