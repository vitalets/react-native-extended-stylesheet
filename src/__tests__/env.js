/**
 * Totally disable automocking as it's really does not work correctly with RN
 *
 * @see https://github.com/facebook/react-native/issues/5532
 * @see https://github.com/facebook/react-native/issues/700#issuecomment-175716320
 */

jest.autoMockOff();
global.ReactMock = require('./react-native-mock').default;
jest.setMock('react-native', global.ReactMock);
