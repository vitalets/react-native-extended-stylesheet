import React from 'react';
import EStyleSheet from '../../src';
import MyComponent from './component';

// calc styles
EStyleSheet.build({
  fontColor: 'black'
});

export default class extends React.Component {
  render() {
    return (
      <MyComponent/>
    );
  }
}
