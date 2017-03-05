/**
 * Renders the same component in two different themes (light & dark)
 */
import React from 'react';
import {View} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import themeLight from './light';
import themeDark from './dark';
import MyComponent from './component';

// set current theme and build styles
const currentTheme = Math.random() > 0.5 ? themeLight : themeDark;
EStyleSheet.build(currentTheme);

export default class extends React.Component {
  render() {
    return (
      <View>
        <MyComponent/>
      </View>
    );
  }
}
