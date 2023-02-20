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

export let I18nManager = {
  isRTL: false
};

export let StyleSheet = {
  create(obj) {
    return Object.keys(obj).reduce((res, key, index) => {
      res[key] = index;
      return res;
    }, {});
  },
  flatten(arr) {
    return arr.reduce((res, item) => Object.assign(res, item), {});
  },
  hairlineWidth: 1
};

export let PixelRatio = {
  get: jest.fn(() => 1),
  roundToNearestPixel(layoutSize) {
    const minPixel = 1 / PixelRatio.get();
    const integerPixels = Math.floor(layoutSize);
    const remainder = layoutSize % integerPixels;
    const roundedPixel = Math.round(remainder / minPixel) * minPixel;

    return integerPixels + roundedPixel;
  }
};

export default {
  Dimensions,
  Platform,
  StyleSheet,
  I18nManager,
  PixelRatio
};
