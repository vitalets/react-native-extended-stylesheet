/**
 * Exports method to create styles in all specified themes
 */
import EStyleSheet from 'react-native-extended-stylesheet';
import themeLight from './light';
import themeDark from './dark';

export default {
  createStyleSheet
}

function createStyleSheet(srcStyles) {
  return {
    light: EStyleSheet.create(Object.assign({}, themeLight, srcStyles)),
    dark: EStyleSheet.create(Object.assign({}, themeDark, srcStyles)),
  };
}
