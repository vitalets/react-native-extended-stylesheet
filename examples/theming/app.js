import React from 'react';
import {View, Button} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MyComponent from './component';
import darkTheme from './dark';
import lightTheme from './light';

EStyleSheet.build(lightTheme);

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      shouldRender: true
    };
  }
  toggleTheme() {
    const theme = EStyleSheet.value('$theme') === 'light' ? darkTheme : lightTheme;
    EStyleSheet.build(theme);
    // setState() called twice to re-render whole component tree
    this.setState({shouldRender: false}, () => this.setState({shouldRender: true}));
  }
  render() {
    if (this.state.shouldRender) {
      const buttonTitle = EStyleSheet.value('$theme') === 'light' ? 'Set dark theme' : 'Set light theme';
      return (
        <View style={{flex: 1}}>
          <MyComponent/>
          <Button title={buttonTitle} onPress={() => this.toggleTheme()}/>
        </View>
      );
    } else {
      return null; // returning null is important to re-render component tree
    }
  }
}
