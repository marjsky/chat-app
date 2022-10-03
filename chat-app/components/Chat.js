import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
export default class Chat extends React.Component {
    componentDidMount(){
      let name = this.props.route.params.name;
      this.props.navigation.setOptions({ title: name });
    }
    render() {
      const { color } = this.props.route.params;
        return (
            <View style={[{backgroundColor: color}, styles.container]}>
              <Button
                title='Go to Start'
                onPress={() => this.props.navigation.navigate('Start')}
              />
            </View>
        );
    };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});