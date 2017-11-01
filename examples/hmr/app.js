import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import MyComponent from './component';

/*
 1. Run app
 2. Enable hot module reload
 3. Click a few times on "Click me" button to set component state
 4. Change $fontColor value below
 5. Watch that font color is changed and component state is saved
*/

EStyleSheet.build({
  $fontColor: 'black' // change this to another color
});

export default class extends React.Component {
  render() {
    return (
      <MyComponent/>
    );
  }
}

module.hot.accept(() => {
  EStyleSheet.clearCache();
  EStyleSheet.build();
});
