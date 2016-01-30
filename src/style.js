/**
 * Style
 */

import osprop from './replacers/osprop';
import vars from './replacers/vars';
import Value from './value';

export default {
  calc
}

/**
 * Calculates style
 * @param {Object} sourceStyle style with variables
 * @param {Array} varsArr array of vars objects
 * @returns {Object} {calculatedVars, calculatedStyles}
 */
function calc(sourceStyle, varsArr = []) {
  let {cleanObj, extractedVars} = vars.extract(sourceStyle);
  let {calculatedVars, updatedVarsArr} = calcVars(extractedVars, varsArr);
  let calculatedStyles = calcPlainObject(cleanObj, updatedVarsArr);
  return {
    calculatedVars,
    calculatedStyles,
  };
}

function calcVars(extractedVars, varsArr) {
  let calculatedVars;
  let updatedVarsArr = varsArr;
  if (extractedVars) {
    let varsArrForVars = [extractedVars].concat(varsArr);
    calculatedVars = calcPlainObject(extractedVars, varsArrForVars);
    updatedVarsArr = [calculatedVars].concat(updatedVarsArr);
  }
  return {
    calculatedVars,
    updatedVarsArr,
  };
}

function calcPlainObject(obj, varsArr) {
  return Object.keys(obj).reduce((res, prop) => {
    let value = obj[prop];
    prop = osprop.replace(prop);
    if (prop) {
      res[prop] = new Value(value, prop, varsArr).calc();
    }
    return res;
  }, {});
}