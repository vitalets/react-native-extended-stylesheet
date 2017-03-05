import React from 'react';
import {Dimensions} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MyComponent from './component';

// define REM depending on screen width
const {width} = Dimensions.get('window');
const rem = width > 340 ? 18 : 17;

// calc styles
EStyleSheet.build({
  $rem: rem,
});

export default class extends React.Component {
  render() {
    return (
      <MyComponent/>
    );
  }
}
