import resolvePath from 'object-resolve-path';

const PREFIX = '$';

export default {
  isVar,
  calc,
  extract,
  get,
  addPrefix,
};

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
    throw new Error(`Unresolved variable: ${str}`);
  }
  return realValue;
}

/**
 * Extract variables / props from mixed object
 * @param {Object} obj
 */
function extract(obj) {
  let extractedProps = {};
  let extractedVars = null;
  Object.keys(obj).forEach(key => {
    if (isVar(key)) {
      extractedVars = extractedVars || {};
      extractedVars[key] = obj[key];
    } else {
      extractedProps[key] = obj[key];
    }
  });
  return {extractedProps, extractedVars};
}

/**
 * Return variable value using provided array of variable sets
 * @param {String} name variable with $, e.g. '$myVar'
 * @param {Array} varsArr array of variable sets
 */
function get(name, varsArr) {
  if (!Array.isArray(varsArr)) {
    throw new Error('You should pass vars array to vars.get()');
  }

  const rootVar = name.match(/[^\.\[]*/)[0];
  const isSimpleVar = rootVar === name;

  // todo: use for.. of after https://github.com/facebook/react-native/issues/4676
  for (let i = 0; i < varsArr.length; i++) {
    let vars = varsArr[i];
    if (!vars || vars[rootVar] === undefined) {
      continue;
    }
    if (isSimpleVar) {
      return vars[name];
    }
    try {
      return resolvePath({[rootVar]: vars[rootVar]}, name);
    } catch (error) {
      return undefined;
    }
  }
}

/**
 * Adds $ to object keys
 * @param {Object} obj
 * @returns {Object}
 */
function addPrefix(obj) {
  return Object.keys(obj).reduce((res, key) => {
    res[`${PREFIX}${key}`] = obj[key];
    return res;
  }, {});
}
