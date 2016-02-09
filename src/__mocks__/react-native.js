/**
 * React-native mock
 */

export let Dimensions = {
  get: () => {
    return {width: 100, height: 200};
  }
};

export let Platform = {
  OS: 'ios'
};

export let StyleSheet = {
  create: (obj) => {
    return Object.keys(obj).reduce((res, key, index) => {
      res[key] = index;
      return res;
    }, {});
  }
};

export default {
  Dimensions,
  Platform,
  StyleSheet,
};
