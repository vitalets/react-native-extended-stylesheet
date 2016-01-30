
jest.autoMockOff();
global.ReactMock = require('./react-native-mock').default;
jest.setMock('react-native', global.ReactMock);
