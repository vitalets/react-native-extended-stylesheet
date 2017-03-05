/**
 * Renders the same component in two different themes (light & dark)
 */
import React from 'react';
import {View} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MyComponent from './component';

EStyleSheet.build();

export default class extends React.Component {
  render() {
    return (
      <View>
        <MyComponent theme="dark"/>
        <MyComponent theme="light"/>
      </View>
    );
  }
}
