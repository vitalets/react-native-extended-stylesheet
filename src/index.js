/**
 * Extended StyleSheet
 */

import Sheet from './sheet';
import style from './style';
import Value from './value';
import vars from './replacers/vars';
import memoize from './memoize';
import child from './child';

let builded = false;
let sheets = [];
let globalVars = null;

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
    sheet.calc(globalVars)
  } else {
    sheets.push(sheet);
  }
  return sheet.getResult();
}

/**
 * Builds all created stylesheets with passed variables
 * @param {Object} [vars]
 */
function build(vars) {
  if (builded) {
    throw new Error('No need to call `EStyleSheet.build` more than once');
  }
  builded = true;
  if (vars) {
    vars = addPrefix(vars);
    globalVars = style.calc(vars, [vars]).calculatedVars;
  }
  sheets.forEach(sheet => sheet.calc(globalVars));
}

/**
 * Calculates particular value. For some values you need to pass prop (e.g. percent)
 * @param {*} expr
 * @param {String} [prop]
 * @returns {*}
 */
function value(expr, prop) {
  let varsArr = globalVars ? [globalVars] : [];
  return new Value(expr, prop, varsArr).calc();
}

/**
 * Resets state
 */
function reset() {
  builded = false;
  globalVars = null;
  sheets.length = 0;
}

/**
 * Adds $ to object keys
 * @param {Object} variables
 * @returns {Object}
 */
function addPrefix(variables) {
  return Object.keys(variables).reduce((res, key) => {
    res[`${vars.PREFIX}${key}`] = variables[key];
    return res;
  }, {});
}
