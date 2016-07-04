import React from 'react';
import EStyleSheet from '../../src';
import MyComponent from './component';

EStyleSheet.build({
  textColor: 'black',
  buttonColor: '#679267',
  outline: 0,
  rem: 18,
});

export default class extends React.Component {
  render() {
    return (
      <MyComponent/>
    );
  }
}
