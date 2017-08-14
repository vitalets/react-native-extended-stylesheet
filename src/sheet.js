import {StyleSheet} from 'react-native';
import Style from './style';
import utils from './utils';
import vars from './replacers/vars';
import mediaQueries from './replacers/media-queries';

export default class {
  /**
   * Constructor
   * @param {Object} source
   */
  constructor(source) {
    this.flattenSource(source);
    this.source = source;
    this.result = Object.create(null);
    this.nativeSheet = {};
    this.varsArr = [];
    this.extractedVars = null;
    this.processedSource = null;
  }

  /**
   * Calculates sheet and update result
   * @param {Object} inVars
   */
  calc(inVars) {
    this.processSource();
    this.calcVars(inVars);
    this.calcStyles();
    this.calcNative();
    return this.getResult();
  }
  
  /**
  * Flatten the source (inline!)
  *
  * Example:
  * source = {
  *   container: {
  *     title: {
  *       color: 'red',
  *       fontSize: 16
  *     },
  *     alert: {
  *        header: {
  *          color: 'blue',
  *          dir: 'rtl'
  *        },
  *        at: 15
  *     }
  *   }
  * }
  * flattenSource(source) -> (source will be now as follows)
  * source = {
  *   container: {},
  *   containerTitle: { color: 'red', fontSize: 16 },
  *   containerAlertHeader: { color: 'blue', dir: 'rtl' },
  *   containerAlert: { at: 15 }
  * }
  *
  * flattenSource(source, false) -> (source will be now as follows)
  * source = {
  *   container: {},
  *   containerTitle: { color: 'red', fontSize: 16 },
  *   alertHeader: { color: 'blue', dir: 'rtl' },
  *   containerAlert: { at: 15 }
  * }
  *
  * Note the difference between containerAlertHeader and alertHeader
  *
  * @param {Object} source Source to be flattened
  * @param {boolean} cumulateNames Indicates whether names will be collected cumulatively, 
  *                                if not true, names will be only the itself and the parent
  *                                together.
  */
  flattenSource(source, cumulateNames = true) {
    (function _flat(obj, root, orgKey, newKey) {
      for (let key in obj) {
          const value = obj[key];
          if (typeof value !== 'object' || value === source)
              continue;
          let newName = newKey || key;
          if (orgKey)
              newName = (cumulateNames ? newKey : orgKey) + key[0].toUpperCase() + key.substr(1);
          _flat(value, obj, key, newName);
      }
      if (!root || root === source)
          return;
      delete root[orgKey];
      source[newKey] = obj;
    })(source);
  }

  processSource() {
    this.processedSource = mediaQueries.process(this.source);
  }

  calcVars(inVars) {
    this.varsArr = inVars ? [inVars] : [];
    this.extractedVars = vars.extract(this.processedSource);
    if (this.extractedVars) {
      let varsArrForVars = [this.extractedVars].concat(this.varsArr);
      let {calculatedVars} = new Style(this.extractedVars, varsArrForVars).calc();
      Object.assign(this.result, calculatedVars);
      this.varsArr = [calculatedVars].concat(this.varsArr);
    }
  }

  calcStyles() {
    const extractedStyles = utils.excludeKeys(this.processedSource, this.extractedVars);
    Object.keys(extractedStyles).forEach(key => {
      if (extractedStyles[key]) {
        this.calcStyle(key, extractedStyles[key]);
      } else {
        this.result[key] = extractedStyles[key];
      }
    });
  }

  calcStyle(key, styleProps) {
    const style = new Style(styleProps, this.varsArr);
    const {calculatedProps, calculatedVars} = style.calc();
    const merged = Object.assign({}, calculatedVars, calculatedProps);
    if (key.charAt(0) === '_') {
      this.result[key] = merged;
    } else {
      this.result['_' + key] = merged;
      this.nativeSheet[key] = calculatedProps;
    }
  }

  calcNative() {
    if (Object.keys(this.nativeSheet).length) {
      let rnStyleSheet = StyleSheet.create(this.nativeSheet);
      Object.assign(this.result, rnStyleSheet);
    }
  }

  getResult() {
    return this.result;
  }
}
