import React from 'react-native';
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
