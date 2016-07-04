/**
 * Class for particular stylesheet
 */

import {StyleSheet} from 'react-native';
import Style from './style';
import layout from './layout';
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
    this.cache = new Map(); // cache styles for `landscape|portrait` orientation
    this.varsArr = [];
    this.extractedVars = null;
    this.processedSource = null;
  }

  /**
   * Calculates sheet and update result
   * @param {Object} inVars
   * @param {Object} [params]
   * @param {Boolean} params.force bypass cache (otherwise we try to use cache)
   */
  calc(inVars, params = {}) {
    utils.clearObject(this.result);
    if (params.force) {
      this.cache.clear();
    } else if (this._tryUseCache()) {
      return this.getResult();
    }
    this._processMediaQueries();
    this._calcVars(inVars);
    this._calcStyles();
    this._calcNative();
    this._saveToCache();
    return this.getResult();
  }

  /**
   * Returns current result
   * @returns {Object}
   */
  getResult() {
    return this.result;
  }

  _processMediaQueries() {
    this.processedSource = mediaQueries.process(this.source);
  }

  _calcVars(inVars) {
    this.varsArr = inVars ? [inVars] : [];
    this.extractedVars = vars.extract(this.processedSource);
    if (this.extractedVars) {
      let varsArrForVars = [this.extractedVars].concat(this.varsArr);
      let {calculatedVars} = new Style(this.extractedVars, varsArrForVars).calc();
      Object.assign(this.result, calculatedVars);
      this.varsArr = [calculatedVars].concat(this.varsArr);
    }
  }

  _calcStyles() {
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

  _calcNative() {
    if (Object.keys(this.nativeSheet).length) {
      const rnStyleSheet = StyleSheet.create(this.nativeSheet);
      Object.assign(this.result, rnStyleSheet);
    }
  }

  /**
   * Try use cache for current orientation
   */
  _tryUseCache() {
    if (this.cache.has[layout.orientation]) {
      Object.assign(this.result, this.cache.get[layout.orientation]);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Saves current result to cache
   */
  _saveToCache() {
    // todo: deep copy?
    this.cache.set[layout.orientation] = Object.assign({}, this.result);
  }
}
