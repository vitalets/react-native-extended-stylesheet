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
      render: true
    };
  }
  toggleTheme() {
    const theme = EStyleSheet.value('$theme') === 'light' ? darkTheme : lightTheme;
    EStyleSheet.build(theme);
    // setState() called twice to re-render whole component tree
    this.setState({render: false}, () => this.setState({render: true}));
  }
  render() {
    if (this.state.render) {
      const buttonTitle = EStyleSheet.value('$theme') === 'light' ? 'Set dark theme' : 'Set light theme';
      return (
        <View style={{flex: 1}}>
          <MyComponent/>
          <Button title={buttonTitle} onPress={() => this.toggleTheme()}/>
        </View>
      );
    } else {
      return null;
    }
  }
}
