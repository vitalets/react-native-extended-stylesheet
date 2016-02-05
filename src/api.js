/**
 * Extended StyleSheet API
 */

import Sheet from './sheet';
import Style from './style';
import Value from './value';
import vars from './replacers/vars';
import memoize from './memoize';
import child from './child';

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
    if (this.builded) {
      throw new Error('No need to call `EStyleSheet.build()` more than once');
    } else {
      this.builded = true;
    }
    this._calcVars(gVars);
    this._calcSheets();
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
}
