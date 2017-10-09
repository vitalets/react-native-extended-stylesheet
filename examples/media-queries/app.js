import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import MyComponent from './component';

// calc styles
EStyleSheet.build({
  '@media ios': { // media queries for global variables
    $fontSize: 12,
  },
  '@media android': {
    $fontSize: 16,
  },
});

export default class extends React.Component {
  render() {
    return (
      <MyComponent/>
    );
  }
}
