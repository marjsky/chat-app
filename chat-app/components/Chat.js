import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import 'react-native-gesture-handler';

const firebase = require('firebase');
require('firebase/firestore');

// https://github.com/wichofly/chat-app/commit/069064381d709bad8d6e1243a575caef2dac8ed9
export default class Chat extends React.Component {
    //state initialization
    constructor() {
      super();
      this.state = {
        messages: [],
        uid: 0,
        user: {
          _id: '',
          name: '',
        } 
      };

      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: "AIzaSyA8Zmb_umm2qm-8KRgaXB8EWPx_QlT9DP4",
          authDomain: "chat-app-2-be68e.firebaseapp.com",
          projectId: "chat-app-2-be68e",
          storageBucket: "chat-app-2-be68e.appspot.com",
          messagingSenderId: "312065980847",
          appId: "1:312065980847:web:c1c7f068f470006f9ed75a",
        });
      }

      //Reference to massages collection on firebase data. Stores and retrieves the chat messages the user send
      this.referenceChatMessages = firebase.firestore().collection('messages');
    }

    // Whenever something change in the messages collection, helps to store the messages and allows the data to be rendered in the view
    onCollectionUpdate = (querySnapshot) => {
      const messages = [];

      // go through each document
      querySnapshot.forEach((doc) => {
        // get the QueryDocumentSnapshot's data
        let data = doc.data();
        messages.push({
          _id: data._id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.user._id,
            name: data.user.name,
          },
        });
      });

      this.setState({
        messages,
      });
    };

    componentDidMount() {
      // set name as title chat from start.js file
      let {name} = this.props.route.params;
      this.props.navigation.setOptions({ title: name });

      // Reference to load messages from Firebase
      this.referenceChatMessages = firebase.firestore().collection('messages');

      // Authenticate user anonymously
      this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          firebase.auth().signInAnonymously();
        }
        
        this.setState({
          uid: user.uid,
          messages: [],
          user: {
            _id: user.uid,
            name: name,
          },
        });
        
        this.unsubscribe = this.referenceChatMessages
          .orderBy('createdAt', 'desc')
          .onSnapshot(this.onCollectionUpdate);
      });
    }

    componentWillUnmount() {
      // stop listening to authentication
      this.authUnsubscribe();
      // stop listening for changes
      this.unsubscribe();
    }

    // to store messages in collection database
    addMessages = (message) => {
      this.referenceChatMessages.add({
        uid: this.state.uid,
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        user: message.user,
      });
    };

    // called user sends a message
    onSend(messages = []) {
      // previousState reference to component's state at the time the change is applied.
      this.setState(previousState => ({
        // the message user has sent gets appended to state messages so that it displayed in chat.
        messages: GiftedChat.append(previousState.messages, messages),
      }),
        () => {
          // call addMessage with last message in message state
          this.addMessages(this.state.messages[0]);
        }
      )
    }



    //bubble customization
    renderBubble(props) {
      return(
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: 'blue',
            },
          }}
        />
      );
    }

    //rendering chat interface
    render() {
  
      const { color, name } = this.props.route.params;

      return (
        <View style={[{backgroundColor: color},{ flex: 1 }]}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: this.state.user._id,
              name: name,
            }}
          />
          {Platform.OS === 'android' ? (
            <KeyboardAvoidingView behavior='height' />
          ) : null}
        </View>
      );
    };
  };