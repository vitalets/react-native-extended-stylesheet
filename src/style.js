/**
 * Style
 */

import vars from './replacers/vars';
import mediaQueries from './replacers/media-queries';
import Value from './value';
import utils from './utils';

export default class {
  /**
   * Constructor
   * @param {Object} source plain object style with variables
   * @param {Array} [varsArr] array of vars objects
   */
  constructor(source, varsArr = []) {
    this.source = source;
    this.varsArr = varsArr;
    this.processedSource = null;
    this.extractedVars = null;
    this.extractedProps = null;
    this.calculatedVars = null;
    this.calculatedProps = null;
  }

  /**
   * Calculates style
   * @returns {Object}
   */
  calc() {
    this.processSource();
    this.calcVars();
    this.calcProps();
    this.tryOutline();
    return {
      calculatedVars: this.calculatedVars,
      calculatedProps: this.calculatedProps,
    };
  }

  processSource() {
    this.processedSource = mediaQueries.process(this.source);
  }

  calcVars() {
    this.extractedVars = vars.extract(this.processedSource);
    if (this.extractedVars) {
      const varsArrForVars = [this.extractedVars].concat(this.varsArr);
      this.calculatedVars = calcPlainObject(this.extractedVars, varsArrForVars);
      this.varsArr = [this.calculatedVars].concat(this.varsArr);
    }
  }

  calcProps() {
    this.extractedProps = utils.excludeKeys(this.processedSource, this.extractedVars);
    this.calculatedProps = calcPlainObject(this.extractedProps, this.varsArr);
  }

  tryOutline() {
    let outline = vars.get('$outline', this.varsArr);
    if (outline) {
      this.calculatedProps.borderWidth = typeof outline === 'number' ? outline : 1;
      this.calculatedProps.borderColor = getRandomColor();
    }
  }

}

/**
 * Calculates values in plain object
 *
 * @param {Object} obj
 * @param {Array} varsArr
 * @returns {Object}
 */
function calcPlainObject(obj, varsArr) {
  return Object.keys(obj).reduce((res, prop) => {
    res[prop] = calcStyleValue(prop, obj[prop], varsArr);
    return res;
  }, {});
}

/**
 * Calculates single value
 * @param {String} prop
 * @param {*} value
 * @param {Array} varsArr
 */
function calcStyleValue(prop, value, varsArr) {
  const isNestedValue = value && typeof value === 'object' && !Array.isArray(value);
  return isNestedValue
    ? calcPlainObject(value, varsArr)
    : new Value(value, prop, varsArr).calc();
}

/**
 * Returns random color (needed for outline)
 * @returns {String}
 */
function getRandomColor() {
  let colors = [
    'black',
    'red',
    'green',
    'blue',
  ];
  let index = Math.round(Math.random() * (colors.length - 1));
  return colors[index];
}
