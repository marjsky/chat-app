import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

// database
import firebase from "firebase";
import 'firebase/firestore';

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
          avatar: '',
        },
        image: null,
        location: null,
        isConnected: null, 
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
          image: data.image || null,
          location: data.location || null,
        });
      });

      this.setState({
        messages,
      });
    };

    async getMessages() {
      let messages = '';
      try {
        // getItem() to read the messages in storage takes a key
        messages = await AsyncStorage.getItem('messages') || [];
        this.setState({
          // convert JSON data into object
          messages: JSON.parse(messages)
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    async saveMessages() {
      try {
        // setItem() to save the messages
        await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
      } catch (error) {
        console.log(error.message);
      }
    }

    async deleteMessages() {
      try {
        await AsyncStorage.removeItem('messages');
        this.setState({
          messages: []
        })
      } catch (error) {
        console.log(error.messages);
      }
    }

    componentDidMount() {
      // set name as title chat from start.js file
      let {name} = this.props.route.params;
      this.props.navigation.setOptions({ title: name });

      // to find put user connection status we call fetch()
      NetInfo.fetch().then((connection) => {
        if (connection.isConnected) {
          this.setState({
            isConnected: true,
          });
          console.log('online');

                  // Reference to load messages via Firebase
        this.referenceChatMessages = firebase
          .firestore()
          .collection('messages');

        // Authenticating users anonymously
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
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
        } else {
          this.setState({
            isConnected: false,
          });
          console.log('offline');

          this.getMessages(); //or messages()
        }
      });

      // if online load message from Firebase, else load messages locally
      if (this.state.isConnected === true) {
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
      } else {
        this.getMessages();
      }
    }

    componentWillUnmount() {
      if (this.isConnected) {
        this.authUnsubscribe();
        this.unsubscribe();
      }
    }

    // to store messages in collection database
    addMessages = () => {
      const message = this.state.messages[0];
      this.referenceChatMessages.add({
        uid: this.state.uid,
        _id: message._id,
        text: message.text || '',
        createdAt: message.createdAt,
        user: message.user,
        image: message.image || null,
        location: message.location || null,
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
          if (this.state.isConnected === true) {
            this.addMessages(this.state.messages[0]);
          }
          
          // storing the messages
          this.addMessages();
          this.saveMessages();
          this.deleteMessages();
        }
      );
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

    // hide input filed when user is offline
    renderInputToolbar(props) {
      if (this.state.isConnected == false) {
      } else {
        return(
          <InputToolbar
          {...props}
          />
        );
      }
    }

    // function deal with circle button
    renderCustomActions = (props) => {
      return <CustomActions {...props} />;
    };

    renderCustomView(props) {
      const { currentMessage } = props;
      if (currentMessage.location) {
        return (
          <MapView
            style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        );
      }
      return null;
    }

    //rendering chat interface
    render() {
  
      const { color } = this.props.route.params;

      return (
      
          <View style={[{backgroundColor: color},{ flex: 1 }]}>
            <GiftedChat
              renderActions={this.renderCustomActions}
              renderCustomView={this.renderCustomView}
              renderBubble={this.renderBubble.bind(this)}
              renderInputToolbar={this.renderInputToolbar.bind(this)}
              messages={this.state.messages}
              onSend={(messages) => this.onSend(messages)}
              user={{
                _id: this.state.user._id,
                name: this.state.user.name,
                
              }}
              
            />
            {Platform.OS === 'android' ? (
              <KeyboardAvoidingView behavior='height' />
            ) : null}
          </View>
        
      );
    };
  };