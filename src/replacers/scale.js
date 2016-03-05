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
 * @param {Number} scaleFactor
 * @returns {number}
 */
function calc(value, scaleFactor) {
  if (typeof value !== 'number') {
    throw new Error('Invalid value for scale: ' + value);
  }
  if (typeof scaleFactor !== 'number') {
    throw new Error('Invalid scaleFactor for scale: ' + scaleFactor);
  }
  return value * scaleFactor;
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
