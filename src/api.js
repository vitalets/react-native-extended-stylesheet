/**
 * Extended StyleSheet API
 */

import {StyleSheet} from 'react-native';
import Sheet from './sheet';
import Style from './style';
import Value from './value';
import vars from './replacers/vars';
import child from './child';

const BUILD_EVENT = 'build';

export default class {
  /**
   * Constructor
   */
  constructor() {
    this.builded = false;
    this.sheets = [];
    this.globalVars = null;
    this.listeners = {};
    this._proxyToOriginal();
    this.child = child;
  }

  /**
   * Creates stylesheet prototype that will be calculated after build
   * @param {Object} obj
   * @returns {Object}
   */
  create(obj) {
    let sheet = new Sheet(obj);
    if (this.builded) {
      sheet.calc(this.globalVars);
    } else {
      this.sheets.push(sheet);
    }
    return sheet.getResult();
  }

  /**
   * Builds all created stylesheets with passed variables
   * @param {Object} [gVars]
   */
  build(gVars) {
    this.builded = true;
    this._calcVars(gVars);
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
   * Subscribe to events. Currently only 'build' event is supported
   * @param {String} event
   * @param {Function} listener
   */
  subscribe(event, listener) {
    if (event !== BUILD_EVENT) {
      throw new Error(`Only '${BUILD_EVENT}' event is currently supported.`);
    }
    if (typeof listener !== 'function') {
      throw new Error('Listener should be a function.');
    }
    if (this.builded) {
      listener();
    } else {
      this.listeners[BUILD_EVENT] = this.listeners[BUILD_EVENT] || [];
      this.listeners[BUILD_EVENT].push(listener);
    }
  }

  _calcVars(gVars) {
    if (gVars) {
      gVars = vars.addPrefix(gVars);
      this.globalVars = new Style(gVars, [gVars]).calc().calculatedVars;
    }
  }

  _calcSheets() {
    this.sheets.forEach(sheet => sheet.calc(this.globalVars));
    this.sheets.length = 0;
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
}
