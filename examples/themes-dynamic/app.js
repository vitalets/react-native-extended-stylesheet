import React from 'react';
import {View, Button} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MyComponent from './component';

EStyleSheet.build();

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      theme: 'dark'
    };
  }
  toggleTheme() {
    const theme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setState({theme});
  }
  render() {
    return (
      <View>
        <MyComponent theme={this.state.theme}/>
        <Button title="Toggle theme!" onPress={() => this.toggleTheme()}/>
      </View>
    );
  }
}
