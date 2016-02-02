/**
 * React-native mock
 * todo: use https://github.com/lelandrichardson/react-native-mock
 */

export default {
  Dimensions: {
    get: () => {
      return {width: 100, height: 200};
    }
  },
  Platform: {
    OS: 'ios'
  },
  StyleSheet: {
    create: (obj) => {
      return Object.keys(obj).reduce((res, key, index) => {
        res[key] = index;
        return res;
      }, {});
    }
  }
};
