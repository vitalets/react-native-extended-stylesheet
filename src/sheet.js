import {StyleSheet} from 'react-native';
import Style from './style';
import vars from './replacers/vars';

export default class {
  /**
   * Constructor
   * @param {Object} source
   */
  constructor(source) {
    this.source = source;
    this.result = {};
    this.nativeSheet = {};
    this.varsArr = [];
  }

  /**
   * Calculates sheet and update result
   * @param {Object} inVars
   */
  calc(inVars) {
    let {extractedProps: extractedStyles, extractedVars} = vars.extract(this.source);
    this.varsArr = inVars ? [inVars] : [];
    if (extractedVars) {
      this.calcVars(extractedVars);
    }
    this.calcStyles(extractedStyles);
    this.calcNative();
  }

  calcVars(extractedVars) {
    let varsArrForVars = [extractedVars].concat(this.varsArr);
    let {calculatedVars} = new Style(extractedVars, varsArrForVars).calc();
    this.copyToResult(calculatedVars);
    this.varsArr = [calculatedVars].concat(this.varsArr);
  }

  calcStyles(extractedStyles) {
    Object.keys(extractedStyles).forEach(key => {
      let {calculatedProps, calculatedVars} = new Style(extractedStyles[key], this.varsArr).calc();
      let merged = merge(calculatedVars || {}, calculatedProps);
      if (key.charAt(0) === '_') {
        this.result[key] = merged;
      } else {
        this.result['_' + key] = merged;
        this.nativeSheet[key] = calculatedProps;
      }
    });
  }

  calcNative() {
    if (Object.keys(this.nativeSheet).length) {
      let rnStyleSheet = StyleSheet.create(this.nativeSheet);
      this.copyToResult(rnStyleSheet);
    }
  }

  copyToResult(obj) {
    Object.keys(obj).forEach(key => this.result[key] = obj[key]);
  }

  getResult() {
    return this.result;
  }
}

function merge(to, from) {
  if (to && from) {
    Object.keys(from).forEach(key => to[key] = from[key] !== undefined ? from[key] : to[key]);
  }
  return to;
}
