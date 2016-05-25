import {StyleSheet, Platform} from 'react-native';
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
      const {calculatedProps, calculatedVars} = new Style(extractedStyles[key], this.varsArr).calc();
      const merged = Object.assign({}, calculatedVars, calculatedProps);
      if (key.charAt(0) === '_') {
        this.result[key] = merged;
      } else {
        this.result['_' + key] = merged;
        this.nativeSheet[key] = calculatedProps;
      }
    });
  }

  calcPlatformStyles() {
    if (Object.keys(this.nativeSheet).length) {
      const platformStyles = {};
      Object.keys(this.nativeSheet).forEach((name) => {
        let {ios, android, ...style} = {...this.nativeSheet[name]};

        if (ios && Platform.OS === 'ios') {
          style = {...style, ...ios};
        }

        if (android && Platform.OS === 'android') {
          style = {...style, ...android};
        }

        platformStyles[name] = style;
      });

      return platformStyles;
    }
  }

  calcNative() {
    if (Object.keys(this.nativeSheet).length) {
      let platformStyles = this.calcPlatformStyles();
      let rnStyleSheet = StyleSheet.create(platformStyles);
      Object.assign(this.result, rnStyleSheet);
    }
  }

  getResult() {
    return this.result;
  }
}
