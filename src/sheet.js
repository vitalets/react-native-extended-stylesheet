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
    this.source = source;
    this.result = {};
    this.cache = new Map(); // cache result for each theme
    this.nativeSheet = {};
    this.globalVars = null;
    this.localVars = null;
    this.allVars = null;
    this.processedSource = null;
  }

  /**
   * Calculates sheet and update result
   * @param {Object} globalVars
   */
  calc(globalVars) {
    this.globalVars = globalVars;
    this.clearResult();
    if (this.hasCache()) {
      this.applyCache();
    } else {
      this.processMediaQueries();
      this.calcVars();
      this.calcStyles();
      this.calcNative();
      this.storeCache();
    }
    return this.getResult();
  }

  processMediaQueries() {
    this.processedSource = mediaQueries.process(this.source);
  }

  calcVars() {
    const rawLocalVars = vars.extract(this.processedSource);
    if (rawLocalVars) {
      this.localVars = new Style(rawLocalVars, [rawLocalVars, this.globalVars]).calc().calculatedVars;
      Object.assign(this.result, this.localVars);
    } else {
      this.localVars = null;
    }
    this.allVars = [this.localVars, this.globalVars].filter(Boolean);
  }

  calcStyles() {
    const extractedStyles = utils.excludeKeys(this.processedSource, this.localVars);
    Object.keys(extractedStyles).forEach(key => {
      let styles = extractedStyles[key];
      if (typeof styles === 'function') {
        styles = styles();
      }
      if (styles && typeof styles === 'object') {
        this.calcStyle(key, styles);
      } else {
        // copy primitive values to result as-is
        this.result[key] = styles;
      }
    });
  }

  calcStyle(key, styleProps) {
    const style = new Style(styleProps, this.allVars);
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
      const rnStyleSheet = StyleSheet.create(this.nativeSheet);
      Object.assign(this.result, rnStyleSheet);
    }
  }

  getResult() {
    return this.result;
  }

  clearResult() {
    Object.keys(this.result).forEach(key => delete this.result[key]);
  }

  hasCache() {
    const key = this.getCacheKey();
    return key && this.cache.has(key);
  }

  applyCache() {
    const cachedResult = this.cache.get(this.getCacheKey());
    Object.assign(this.result, cachedResult);
  }

  storeCache() {
    const key = this.getCacheKey();
    if (key) {
      this.cache.set(key, Object.assign({}, this.result));
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheKey() {
    return this.globalVars && this.globalVars.$theme;
  }
}
