/**
 * Media queries
 * Supported values:
 * - (type) ios, android
 * - height, min-height, max-height
 * - width, min-width, max-width
 * - orientation
 * - aspect-ratio
 */

import {Dimensions, Platform, I18nManager} from 'react-native';
import mediaQuery from 'css-mediaquery';
import utils from '../utils';
      
const PREFIX = '@media';

export default {
  isMediaQuery,
  process
};

/**
 * Is string is media query
 * @param {String} str
 */
function isMediaQuery(str) {
  return typeof str === 'string' && str.indexOf(PREFIX) === 0;
}

/**
 * Process and apply media queries in object
 * @param {Object} obj
 * @returns {null|Object}
 */
function process(obj) {
  const mqKeys = [];

  // copy non-media-query stuff
  const res = Object.keys(obj).reduce((res, key) => {
    if (!isMediaQuery(key)) {
      res[key] = obj[key];
    } else {
      mqKeys.push(key);
    }
    return res;
  }, {});

  // apply media query stuff
  if (mqKeys.length) {
    const matchObject = getMatchObject();
    mqKeys.forEach(key => {
      const mqStr = key.replace(PREFIX, '');
      const isMatch = mediaQuery.match(mqStr, matchObject);
      if (isMatch) {
        merge(res, obj[key]);
      }
    });
  }

  return res;
}

/**
 * Returns object to match media query
 * @returns {Object}
 */
function getMatchObject() {
  const win = Dimensions.get('window');
  const { isRTL } = I18nManager;
  return {
    width: win.width,
    height: win.height,
    orientation: win.width > win.height ? 'landscape' : 'portrait',
    'aspect-ratio': win.width / win.height,
    type: Platform.OS,
    direction: isRTL ? 'rtl' : 'ltr'
  };
}

/**
 * Merge media query obj into parent obj
 * @param {Object} obj
 * @param {Object} mqObj
 */
function merge(obj, mqObj) {
  Object.keys(mqObj).forEach(key => {
    if (utils.isObject(obj[key]) && utils.isObject(mqObj[key])) {
      Object.assign(obj[key], mqObj[key]);
    } else {
      obj[key] = mqObj[key];
    }
  });
}
