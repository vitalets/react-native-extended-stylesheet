/**
 * Utils
 */
import {Dimensions} from 'react-native';

export default {
  excludeKeys,
  isObject,
  calcOrientation
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

function calcOrientation(orientation){
  var {width, height} = Dimensions.get('window');
  if(orientation){
    orientation = orientation.toLowerCase();
  }
  var newWidth = width;
  var newHeight = height;

  if (orientation == 'landscape') {
    if(height > width){
      var newWidth = height;
      var newHeight = width;
    }
  }else if (orientation == 'portrait') {
    if(width > height){
      var newWidth = height;
      var newHeight = width;
    }
  }
  if(!orientation){
    orientation = newWidth > newHeight ? 'landscape' : 'portrait'
  }
  return {width: newWidth, height: newHeight, orientation: orientation};
}
