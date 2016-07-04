/**
 * Manage sheet list
 */
import Sheet from './sheet';

export default class {
  /**
   * Constructor
   */
  constructor() {
    this._sheets = [];
  }

  /**
   * Creates stylesheet that will be calculated after build
   * @param {Object} obj
   * @returns {Object}
   */
  create(obj) {
    const sheet = new Sheet(obj);
    this._sheets.push(sheet);
    return sheet;
  }

  /**
   * Calc all stylesheets
   * @param {Object} [vars]
   * @param {Object} [params]
   */
  calc(vars, params) {
    this._sheets.forEach(sheet => sheet.calc(vars, params));
  }
}
