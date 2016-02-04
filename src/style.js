/**
 * Style
 */

import osprop from './replacers/osprop';
import vars from './replacers/vars';
import Value from './value';

export default class {
  /**
   * Constructor
   * @param {Object} source plain object style with variables
   * @param {Array} [varsArr] array of vars objects
   */
  constructor(source, varsArr = []) {
    this.source = source;
    this.varsArr = varsArr;
    this.calculatedVars = null;
    this.calculatedProps = null;
  }

  /**
   * Calculates style
   * @returns {Object} {calculatedVars, calculatedStyles}
   */
  calc() {
    let {extractedProps, extractedVars} = vars.extract(this.source);
    if (extractedVars) {
      this.calcVars(extractedVars);
    }
    this.calcProps(extractedProps);
    return {
      calculatedVars: this.calculatedVars,
      calculatedProps: this.calculatedProps,
    };
  }

  calcVars(extractedVars) {
    let varsArrForVars = [extractedVars].concat(this.varsArr);
    this.calculatedVars = calcPlainObject(extractedVars, varsArrForVars);
    this.varsArr = [this.calculatedVars].concat(this.varsArr);
  }

  calcProps(extractedProps) {
    this.calculatedProps = calcPlainObject(extractedProps, this.varsArr);
    this.tryOutline();
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
    let value = obj[prop];
    prop = osprop.replace(prop);
    if (prop) {
      res[prop] = new Value(value, prop, varsArr).calc();
    }
    return res;
  }, {});
}

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
