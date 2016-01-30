
const PREFIX = '$';

export default {
  PREFIX,
  isVar,
  calc,
  extract,
  get,
}

/**
 * Is string equals to another variable: '$varName'
 * @param {String} str
 */
function isVar(str) {
  return typeof str === 'string' && str.charAt(0) === PREFIX;
}

/**
 * Replace var with value from vars arr.
 * @param {String} str variable name with $, e.g. '$color'
 * @param {Array<Object>} varsArr array of variable sets to search into.
 */
function calc(str, varsArr) {
  let realValue = get(str, varsArr);
  if (realValue === undefined) {
    throw new Error('Unresolved variable: ' + str)
  }
  return realValue;
}

/**
 * Extract variables from object and returns vars and clean obj
 * @param {Object} obj
 */
function extract(obj) {
  let cleanObj = {};
  let extractedVars;
  Object.keys(obj).forEach(key => {
    if (isVar(key)) {
      extractedVars = extractedVars || {};
      extractedVars[key] = obj[key];
    } else {
      cleanObj[key] = obj[key];
    }
  });
  return {cleanObj, extractedVars};
}

/**
 * Return variable value using provided array of variable sets
 * @param {String} name variable without $
 * @param {Array} varsArr array of variable sets
 */
function get(name, varsArr) {
  for (let vars of varsArr) {
    if (vars && vars[name] !== undefined) {
      return vars[name];
    }
  }
}