/**
 * Modifications applied when use magic $get function
 * - conditional apply
 * - :first-child, :last-child, :nth-child-even
 */

const modificators = {
  child,
};

export default {
  getStyle,
}

/**
 * Returns style or array of styles by modificator
 * @param {Object} styles
 * @param {String} styleName
 * @param {Array} args
 */
function getStyle(styles, styleName, ...args) {
  // simply return style
  if (args.length === 0) {
    return styles[styleName];
  }

  // conditional apply style
  if (args.length === 1) {
    return args[0] ? styles[styleName] : null;
  }

  let modificator = args[0];
  return modificators.hasOwnProperty(modificator)
    ? modificators[modificator](styles, styleName, args.slice(1))
    : styles[styleName];
}

/**
 * Returns base style and style with child pseudo selector
 * @param {Object} styles
 * @param {String} styleName
 * @param {Array} params [index, count]
 */
function child(styles, styleName, params) {
  if (!assertParams(params, ['number', 'number'])) {
    return styles[styleName];
  }

  let result = [styles[styleName]];
  let index = params[0];
  let count = params[1];

  addStyle(result, styles, styleName + ':first-child', index === 0);
  addStyle(result, styles, styleName + ':nth-child-even', index < count && index % 2 === 0);
  addStyle(result, styles, styleName + ':last-child', index === count - 1);

  return result.length > 1 ? result : result[0];
}

function addStyle(result, styles, styleName, condition) {
  if (styles[styleName] && condition) {
    result.push(styles[styleName]);
  }
}

function assertParams(params, types) {
  if (!Array.isArray(params) || params.length !== types.length) {
    return false;
  }
  for(let i = 0; i < params.length; i++) {
    if (typeof params[i] !== types[i]) {
      return false;
    }
  }
  return true;
}