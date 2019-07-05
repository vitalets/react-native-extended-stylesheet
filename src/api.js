/**
 * Extended StyleSheet API
 */

import {StyleSheet} from 'react-native';
import Sheet from './sheet';
import Style from './style';
import Value from './value';
import vars from './replacers/vars';
import mq from './replacers/media-queries';
import child from './child';

const BUILD_EVENT = 'build';

export default class EStyleSheet {
  /**
   * Constructor
   */
  constructor() {
    this.child = child;
    this.builded = false;
    this.sheets = [];
    this.globalVars = null;
    this.listeners = {};
    this._proxyToOriginal();
  }

  /**
   * Creates stylesheet that will be calculated after build
   * @param {Object} obj
   * @returns {Object}
   */
  create(obj) {
    const sheet = new Sheet(obj);
    // todo: add options param to allow create dynamic stylesheets that should not be stored
    this.sheets.push(sheet);
    if (this.builded) {
      sheet.calc(this.globalVars);
    }
    return sheet.getResult();
  }

  /**
   * Builds all created stylesheets with passed variables
   * @param {Object} [rawGlobalVars]
   */
  build(rawGlobalVars) {
    this.builded = true;
    this._calcGlobalVars(rawGlobalVars);
    this._calcSheets();
    this._callListeners(BUILD_EVENT);
  }

  /**
   * Calculates particular value. For some values you need to pass prop (e.g. percent)
   * @param {*} expr
   * @param {String} [prop]
   * @returns {*}
   */
  value(expr, prop) {
    let varsArr = this.globalVars ? [this.globalVars] : [];
    return new Value(expr, prop, varsArr).calc();
  }

  /**
   * Subscribe to event. Currently only 'build' event is supported.
   * @param {String} event
   * @param {Function} listener
   */
  subscribe(event, listener) {
    this._assertSubscriptionParams(event, listener);
    this.listeners[BUILD_EVENT] = this.listeners[BUILD_EVENT] || [];
    this.listeners[BUILD_EVENT].push(listener);
    if (this.builded) {
      listener();
    }
  }

  /**
   * Unsubscribe from event. Currently only 'build' event is supported.
   * @param {String} event
   * @param {Function} listener
   */
  unsubscribe(event, listener) {
    this._assertSubscriptionParams(event, listener);
    if (this.listeners[BUILD_EVENT]) {
      this.listeners[BUILD_EVENT] = this.listeners[BUILD_EVENT].filter(item => item !== listener);
    }
  }

  /**
   * Clears all cached styles.
   */
  clearCache() {
    this.sheets.forEach(sheet => sheet.clearCache());
  }

  // todo: move global vars stuff to separate module
  _calcGlobalVars(rawGlobalVars) {
    if (rawGlobalVars) {
      this._checkGlobalVars(rawGlobalVars);
      // $theme is system variable used for caching
      rawGlobalVars.$theme = rawGlobalVars.$theme || 'default';
      this.globalVars = new Style(rawGlobalVars, [rawGlobalVars]).calc().calculatedVars;
    }
  }

  _calcSheets() {
    this.sheets.forEach(sheet => sheet.calc(this.globalVars));
  }

  _callListeners(event) {
    if (Array.isArray(this.listeners[event])) {
      this.listeners[event].forEach(listener => listener());
    }
  }

  _proxyToOriginal() {
    // see: https://facebook.github.io/react-native/docs/stylesheet.html
    const props = [
      'setStyleAttributePreprocessor',
      'hairlineWidth',
      'absoluteFill',
      'absoluteFillObject',
      'flatten',
    ];
    props.forEach(prop => {
      Object.defineProperty(this, prop, {
        get: () => StyleSheet[prop],
        enumerable: true,
      });
    });
  }

  _checkGlobalVars(rawGlobalVars) {
    Object.keys(rawGlobalVars).forEach(key => {
      if (!vars.isVar(key) && !mq.isMediaQuery(key)) {
        throw new Error(
          `EStyleSheet.build() params should contain global variables (start with $) ` +
          `or media queries (start with @media). Got '${key}'.`
        );
      }
    });
  }

  _assertSubscriptionParams(event, listener) {
    if (event !== BUILD_EVENT) {
      throw new Error(`Only '${BUILD_EVENT}' event is currently supported.`);
    }
    if (typeof listener !== 'function') {
      throw new Error('Listener should be a function.');
    }
  }
}
