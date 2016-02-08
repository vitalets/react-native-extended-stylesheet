/**
 * Totally disable automocking as it's really does not work correctly
 */

jest.autoMockOff();
global.ReactMock = require('./react-native-mock').default;
jest.setMock('react-native', global.ReactMock);
