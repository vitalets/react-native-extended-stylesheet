import React from 'react';
import {Dimensions} from 'react-native';
import EStyleSheet, {AppContainer} from '../../src';
import MyComponent from './my-component';

// calc styles
//EStyleSheet.build({
//  layoutMarginTop: 25
//});

EStyleSheet.setGlobals({x: 1});
EStyleSheet.setLayout(Dimensions.get('window'));

export default class extends React.Component {
  render() {
    return (
      <AppContainer>
        <MyComponent/>
      </AppContainer>
    );
  }
}
