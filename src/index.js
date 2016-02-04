/**
 * Extended StyleSheet API
 */

import Sheet from './sheet';
import Value from './value';
import memoize from './memoize';
import child from './child';
import sheetList from './sheet-list';
import globalVars from './global-vars';

let builded = false;

export default {
  create,
  build,
  value,
  reset,
  memoize,
  child,
};

/**
 * Creates stylesheet prototype that will be calculated after build
 * @param {Object} obj
 * @returns {Object}
 */
function create(obj) {
  let sheet = new Sheet(obj);
  if (builded) {
    sheet.calc(globalVars.get());
  } else {
    sheetList.add(sheet);
  }
  return sheet.getResult();
}

/**
 * Builds all created stylesheets with passed variables
 * @param {Object} [gVars]
 */
function build(gVars) {
  if (builded) {
    throw new Error('No need to call `EStyleSheet.build()` more than once');
  } else {
    builded = true;
  }
  globalVars.set(gVars);
  sheetList.calc(globalVars.get());
}

/**
 * Calculates particular value. For some values you need to pass prop (e.g. percent)
 * @param {*} expr
 * @param {String} [prop]
 * @returns {*}
 */
function value(expr, prop) {
  let varsArr = globalVars.get() ? [globalVars.get()] : [];
  return new Value(expr, prop, varsArr).calc();
}

/**
 * Resets state
 */
function reset() {
  builded = false;
  globalVars.clear();
  sheetList.clear();
}
