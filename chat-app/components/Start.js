import React, { Component } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BackgroundImage from '../assets/bimg.png';
export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', color: ''};
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode='cover'
          style={styles.bgImage}
          >
            <Text style={styles.title}>Chat App</Text>
            <View style={styles.containerLogin}>
            {/* user input name to display in chat */}
            <TextInput
              style={styles.textInputName}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Your Name'
              accessibilityLabel='Type your Name'
            />
            {/* user choice color for chat background */}
            <View style={styles.colorChoiceBox}>
              <Text style={styles.colorChoiceText}>Choose Background Color:</Text>
              <View style={styles.colorChoice}>
                <TouchableOpacity
                  onPress={() => this.setState({ color: '#090C08' })}
                  style={styles.colorBlack}
                  accessible={true}
                  accessibilityLabel='Black'
                  accessibilityHint='Set background color to Black.'
                  accessibilityRole='button'
                />
                <TouchableOpacity
                  onPress={() => this.setState({ color: '#474056' })}
                  style={styles.colorPurple}
                  accessible={true}
                  accessibilityLabel='Purple'
                  accessibilityHint='Set background color to Purple.'
                  accessibilityRole='button'
                />
                <TouchableOpacity
                  onPress={() => this.setState({ color: '#8A95A5' })}
                  style={styles.colorGrey}
                  accessible={true}
                  accessibilityLabel='Grey'
                  accessibilityHint='Set background color to Grey.'
                  accessibilityRole='button'
                />
                <TouchableOpacity
                  onPress={() => this.setState({ color: '#B9C6AE' })}
                  style={styles.colorGreen}
                  accessible={true}
                  accessibilityLabel='Green'
                  accessibilityHint='Set background color to Green.'
                  accessibilityRole='button'
                />
              </View>
            </View>
            {/* user enter chat */}
            <Pressable
              style={styles.btnStart}
              title="Start Chatting"
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
              accessible={true}
              accessibilityLabel='Start Chatting'
              accessibilityRole='button'
            >
              <Text style={styles.btnStartChat}>Start Chatting</Text>
            </Pressable>
            </View>
        </ImageBackground>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    fontSize: 45,
    textAlign: 'center',
    color: '#fff',
  },
  containerLogin: {
    position: 'absolute',
    bottom: 30,
    padding: 15,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 4,
    height: '44%',
    width: '88%',
    alignSelf: 'center',
  },
  textInputName: {
    height: 70,
    borderColor: '#757083',
    borderWidth: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: .5,
    padding: 15,
  },
  colorChoiceText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
  },
  colorChoice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    padding: 5,
  },
  colorBlack: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: '#090C08',
  },
  colorPurple: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: '#474056',
  },
  colorGrey: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: '#8A95A5',
  },
  colorGreen: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: '#B9C6AE',
  },
  btnStart: {
    height: 70,
    backgroundColor: '#757083',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStartChat: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});