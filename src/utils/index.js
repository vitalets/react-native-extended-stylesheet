/**
 * Utils
 */

export default {
  excludeKeys,
  isObject,
  clearObject,
  memoize,
};

/**
 * Returns new object with excluded keys
 * @param {Object} obj
 * @param {Array|Object} keys
 */
function excludeKeys(obj, keys) {
  keys = Array.isArray(keys)
    ? keys
    : (keys ? Object.keys(keys) : []);
  return Object.keys(obj).reduce((res, key) => {
    if (keys.indexOf(key) === -1) {
      res[key] = obj[key];
    }
    return res;
  }, {});
}

/**
 * Is object
 * @param {*} obj
 */
function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

/**
 * Deletes all own object props
 * @param {Object} obj
 */
function clearObject(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }
  Object.keys(obj).forEach(key => delete obj[key]);
}

/**
 * Returns function that cache calls with the same arguments
 * @param {Function} fn
 * @returns {Function}
 */
function memoize(fn) {
  return function m(...args) {
    m.cache = m.cache || {};
    let key = args.join('|');
    m.cache[key] = key in m.cache ? m.cache[key] : fn(...args);
    return m.cache[key];
  };
}
