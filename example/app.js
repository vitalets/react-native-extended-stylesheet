import React, {Dimensions} from 'react-native';
import EStyleSheet from '../src';

import MyComponent from './component';
import theme from './theme';

// define REM depending on screen width
let {width} = Dimensions.get('window');
const rem = width > 340 ? 16 : 15;

// calc styles
EStyleSheet.build({...theme, rem});

export default class extends React.Component {
  render() {
    return (
      <MyComponent/>
    );
  }
}