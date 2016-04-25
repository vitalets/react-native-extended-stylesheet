## How to run examples

1. Create new react-native project

  ```bash
  react-native init ExtendedStyleSheetExample
  cd ExtendedStyleSheetExample
  ```
  
2. Install `react-native-extended-stylesheet`

  ```bash
  npm i react-native-extended-stylesheet
  ```
  
3. Change `index.ios.js` and `index.android.js` to:

  ```js
  import {AppRegistry} from 'react-native';
  import App from 'react-native-extended-stylesheet/examples/simple/app';
  AppRegistry.registerComponent('ExtendedStyleSheetExample', () => App);
  ```
  
