/**
 * OS dependent props
 */
import {Platform} from 'react-native';

const isIOS = Platform.OS === 'ios';
const isAndroid = !isIOS;

export default {
  replace: function (prop) {
    const l = prop.length;
    if (prop.substr(l - 7) === 'Android') {
      return isAndroid ? prop.substr(0, l - 7) : '';
    }
    if (prop.substr(l - 3) === 'IOS') {
      return isIOS ? prop.substr(0, l - 3) : '';
    }
    return prop;
  }
}