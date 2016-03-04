/**
 * Detects operation in string
 * Supports: '*', '+', '-'
 */

const operators = {
  '*': (v1, v2) => v1 * v2,
  '+': (v1, v2) => v1 + v2,
  '-': (v1, v2) => v1 - v2,
};

/**
 * Prevents flexbox's justifyContent values from being treated as operator
 */

const noops = ['flex-start', 'flex-end', 'space-around', 'space-between'];

export default {
  isOperation,
  exec,
};

/**
 * Is operation in string: '0.25 * $abc' => {operator: '*', v1: '0.25', v2: '$abc'}
 * @param {String} str
 */
function isOperation(str) {
  let opInfo = findOperator(str);
  if (opInfo) {
    opInfo.v1 = str.substr(0, opInfo.pos).trim();
    opInfo.v2 = str.substr(opInfo.pos + 1).trim();
    delete opInfo.pos;
    return opInfo;
  } else {
    return false;
  }
}

/**
 * Executes operation
 * @param {Object} opInfo
 */
function exec(opInfo) {
  assertOperator(opInfo.operator);
  assertValue(opInfo.v1);
  assertValue(opInfo.v2);
  let fn = operators[opInfo.operator];
  return fn(opInfo.v1, opInfo.v2);
}

function findOperator(str) {
  for (let operator in operators) {
    let pos = str.indexOf(operator);
    let skip = noops.indexOf(str);

    if (pos >= 0 && skip === -1) {
      return {operator, pos};
    }
  }
}

function assertOperator(operator) {
  if (!operators[operator]) {
    throw new Error('Unknown operator: ' + operator);
  }
}

function assertValue(value) {
  if (typeof value !== 'number') {
    throw new Error('Operation value should be number, you try: ' + value);
  }
}
