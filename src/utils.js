/**
 * Utils
 */
import {Dimensions} from 'react-native';

export default {
  excludeKeys,
  isObject,
  setDimensions,
  getDimensions
};

/**
 * Returns new object with excluded keys
 * @param {Object} obj
 * @param {Array|Object} keys
 */
function excludeKeys(obj, keys) {
  keys = Array.isArray(keys)
    ? keys
    : (keys ? Object.keys(keys) : []);
  return Object.keys(obj).reduce((res, key) => {
    if (keys.indexOf(key) === -1) {
      res[key] = obj[key];
    }
    return res;
  }, {});
}

/**
 * Is object
 * @param {*} obj
 */
function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function setDimensions(layout, defaultLayout){
  defaultLayout = defaultLayout || false;
  var updated = false;
  if(!defaultLayout){
    if(window.dimensions.width !== layout.width){
      updated = true;
    }
  }
  return window.dimensions = {
    orientation: (layout.width < layout.height ? 'portrait' : 'landscape'),
    width: layout.width,
    height: layout.height,
    default: defaultLayout,
    updated: updated
  }
}

function getDimensions(){
  if(!window.dimensions){
    setDimensions(Dimensions.get('window'), true);
  }
  return window.dimensions;
}
