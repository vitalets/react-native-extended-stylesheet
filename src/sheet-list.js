/**
 * List of sheets
 */

let sheets = [];

export default {
  add,
  calc,
  clear,
};

/**
 * Add sheet to list that will be calculated after build
 * @param {Object} sheet
 */
function add(sheet) {
  sheets.push(sheet);
}

/**
 * Calculates all sheets in list
 * @param {Object} [globalVars]
 */
function calc(globalVars) {
  sheets.forEach(sheet => sheet.calc(globalVars));
}

/**
 * Clears sheets
 */
function clear() {
  sheets.length = 0;
}
