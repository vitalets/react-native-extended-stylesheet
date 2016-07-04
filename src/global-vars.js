/**
 * Singleton containing stylesheet global variables
 */

import Style from './style';
import vars from './replacers/vars';

class GlobalVars {
  /**
   * Constructor
   */
  constructor() {
    this._vars = Object.create(null);
  }

  /**
   * Calculate global vars
   * @param {Object|undefined} sourceVars
   */
  calc(sourceVars) {
    if (sourceVars) {
      sourceVars = vars.addPrefix(sourceVars);
      // calculate vars using recursively vars itself
      this._vars = new Style(sourceVars, [sourceVars]).calc().calculatedVars;
    }
  }

  /**
   * Returns current global vars
   */
  get() {
    return this._vars;
  }
}

export default new GlobalVars();
