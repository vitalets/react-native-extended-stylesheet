/**
 * Scale property if needed
 */

const SCALABLE_PROPS = [
  'width',
  'height',
  'margin',
  'padding',
  'fontsize',
  'radius',
];

export default {
  isScalable,
  calc,
};

/**
 * Is value & property scalable
 * @param {*} value
 * @param {String} prop
 * @returns {Boolean}
 */
function isScalable(value, prop) {
  return typeof value === 'number' && isScalableProp(prop);
}

/**
 * Performs scaling
 * @param {Number} value
 * @param {Number} scaleValue
 * @returns {number}
 */
function calc(value, scaleValue) {
  if (isNaN(value)) {
    throw new Error('Invalid value for scale: ' + value);
  }
  if (isNaN(scaleValue)) {
    throw new Error('Invalid value for scale: ' + scaleValue);
  }
  return value * scaleValue;
}

function isScalableProp(prop) {
  if (typeof prop !== 'string') {
    return false;
  }
  prop = prop.toLowerCase();
  return SCALABLE_PROPS.some(p => {
    return prop.indexOf(p) >= 0;
  });
}