import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import 'react-native-gesture-handler';
export default class Chat extends React.Component {
  //state initialization
  constructor() {
    super();
    this.state = {
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ], 
    }
  }

  componentDidMount() {
    let {name} = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
  }

  //reference to component's state at the time the change is applied
  // message a user has sent gets appended to state messages so that it displayed in chat
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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
 
    const { color } = this.props.route.params;
      return (
        <View style={[{backgroundColor: color},{ flex: 1 }]}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: 1,
            }}
          />
          {Platform.OS === 'android' ? (
            <KeyboardAvoidingView behavior='height' />
          ) : null}
        </View>
      );
  };
}