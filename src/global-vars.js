/**
 * Singleton with global vars
 */

import vars from './replacers/vars';
import Style from './style';

let globalVars = null;

export default {
  set,
  get,
  clear,
};

/**
 * Sets and calculates global vars
 * @param {Object} [gVars]
 */
function set(gVars) {
  if (gVars) {
    gVars = vars.addPrefix(gVars);
    globalVars = new Style(gVars, [gVars]).calc().calculatedVars;
  }
}

/**
 * Returns global vars
 * @returns {Object|null}
 */
function get() {
  return globalVars;
}

/**
 * Clears global vars
 */
function clear() {
  globalVars = null;
}
