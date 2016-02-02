import {StyleSheet} from 'react-native';
import style from './style';
import vars from './replacers/vars';

export default class {
  constructor(source) {
    this.source = source;
    this.result = {};
    this.nativeSheet = {};
  }

  calc(inVars) {
    let {cleanObj, extractedVars} = vars.extract(this.source);
    let varsArr = this.getVarsArr(extractedVars, inVars);
    this.calcStyles(cleanObj, varsArr);
    this.calcNative();
  }

  calcStyles(cleanObj, varsArr) {
    Object.keys(cleanObj).forEach(key => {
      let {calculatedStyles, calculatedVars} = style.calc(cleanObj[key], varsArr);
      let merged = merge(calculatedVars || {}, calculatedStyles);
      if (key.charAt(0) === '_') {
        this.result[key] = merged;
      } else {
        this.result['_' + key] = merged;
        this.nativeSheet[key] = calculatedStyles;
      }
    });
  }

  calcNative() {
    if (Object.keys(this.nativeSheet).length) {
      let rnStyleSheet = StyleSheet.create(this.nativeSheet);
      this.copyToResult(rnStyleSheet);
    }
  }

  getVarsArr(extractedVars, inVars) {
    let result = inVars ? [inVars] : [];
    if (extractedVars) {
      let varsArrForVars = [extractedVars].concat(result);
      let {calculatedVars} = style.calc(extractedVars, varsArrForVars);
      this.copyToResult(calculatedVars);
      result.unshift(calculatedVars);
    }
    return result;
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
