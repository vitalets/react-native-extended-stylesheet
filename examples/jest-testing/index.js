import { AppRegistry } from 'react-native';
import App from './App';

import EStyleSheet from 'react-native-extended-stylesheet';

EStyleSheet.build({
  $fontColor: '#F5FCFF',
});

AppRegistry.registerComponent('AwesomeProject', () => App);

