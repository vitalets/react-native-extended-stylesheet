/**
 * Returns function that cache calls with the same arguments
 */
export default function (fn) {
  return function m(...args) {
    m.cache = m.cache || {};
    let key = args.join('|');
    m.cache[key] = key in m.cache ? m.cache[key] : fn(...args);
    return m.cache[key];
  };
}
