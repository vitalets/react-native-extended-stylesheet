/**
 * Implementation of CSS pseudo class :first-child, :last-child, :nth-child
 */

/**
 * Returns base style and style with child pseudo selector
 * @param {Object} styles
 * @param {String} styleName
 * @param {Number} index
 * @param {Number} count
 */
export default function (styles, styleName, index, count) {
  if (!isNumber(index) || !isNumber(count)) {
    return styles[styleName];
  }

  let result = [styles[styleName]];

  addStyle(result, styles, styleName + ':first-child', index === 0);
  addStyle(result, styles, styleName + ':nth-child-even', index < count && index % 2 === 0);
  addStyle(result, styles, styleName + ':nth-child-odd', index < count && index % 2 === 1);
  addStyle(result, styles, styleName + ':last-child', index === count - 1);

  return result.length > 1 ? result : result[0];
}

function addStyle(result, styles, styleName, condition) {
  if (styles[styleName] && condition) {
    result.push(styles[styleName]);
  }
}

function isNumber(value) {
  return typeof value === 'number';
}
