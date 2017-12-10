import { getStylesForProperty } from 'css-to-react-native';

const UNIT = 'px';

export default {
  hasUnitPostfix,
  addUnit,
  calc
};

/**
 * Determine if value has already 'px' or not
 * @param {*} value 
 */
function hasUnitPostfix(value) {
  return value.includes(UNIT)
}

/**
 * Add 'px' unit to each value from shorthand
 * @param {*} value 
 */
function addUnit(value) {
  return value.replace(/([0-9]+)/g, `$1${UNIT}`);
}

/**
 * Returns object with calculated RN styles
 * @param {*} prop 
 * @param {*} value 
 */
function calc(prop, value) {
  return getStylesForProperty(prop, value)
}
