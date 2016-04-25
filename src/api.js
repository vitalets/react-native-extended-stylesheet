/**
 * Extended StyleSheet API
 */

import Sheet from './sheet';
import Style from './style';
import Value from './value';
import vars from './replacers/vars';
import memoize from './memoize';
import child from './child';

const BUILD_EVENT = 'build';

export default class {
  memoize = memoize;
  child = child;

  /**
   * Constructor
   */
  constructor() {
    this.builded = false;
    this.sheets = [];
    this.globalVars = null;
    this.listeners = {};
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
}
