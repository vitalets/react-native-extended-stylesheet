// as osprop detects os on start, mock react-native nere manually
let Platform = {
  OS: 'ios'
};
jest.setMock('react-native', {Platform});

describe('osprop', function () {
  beforeEach(function () {
    delete require.cache['../osprop'];
  });

  it('should replace android prop on android', function () {
    Platform.OS = 'android';
    const osprop = require('../osprop').default;
    expect(osprop.replace('propAndroid')).toBe('prop');
  });

  it('should remove android prop on ios', function () {
    Platform.OS = 'ios';
    const osprop = require('../osprop').default;
    expect(osprop.replace('propAndroid')).toBe('');
  });

  it('should replace ios prop on ios', function () {
    Platform.OS = 'ios';
    const osprop = require('../osprop').default;
    expect(osprop.replace('propIOS')).toBe('prop');
  });

  it('should remove ios prop on android', function () {
    Platform.OS = 'android';
    const osprop = require('../osprop').default;
    expect(osprop.replace('propIOS')).toBe('');
  });

  it('should keep non-os props', function () {
    Platform.OS = 'android';
    const osprop = require('../osprop').default;
    expect(osprop.replace('prop')).toBe('prop');
  });
});
