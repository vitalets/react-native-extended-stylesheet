const rn = {
  Platform: {
    OS: 'ios'
  },
  Dimensions: {
    get: () => {
      return {width: 110, height: 100};
    }
  }
};

jest.setMock('react-native', rn);

delete require.cache['../media-queries'];
const mq = require('../media-queries').default;

describe('media-queries', function () {

  it('should extract and apply media queries', function () {
    const obj = {
      a: 1,
      b: 2,
      '@media (min-width: 50) and (min-height: 100)': {
        a: 2,
        c: 3,
        d: 4
      },
      '@media ios': {
        d: 5,
      }
    };
    expect(mq.process(obj)).toEqual({
      a: 2,
      b: 2,
      c: 3,
      d: 5
    });
  });

  it('should process width', function () {
    const obj = {
      '@media (min-width: 50) and (max-width: 150)': {
        a: 1,
      },
      '@media (min-width: 150) and (max-width: 200)': {
        a: 2,
      }
    };
    expect(mq.process(obj)).toEqual({a: 1});
  });

  it('should process height', function () {
    const obj = {
      '@media (min-height: 50) and (max-height: 150)': {
        a: 1,
      },
      '@media (min-height: 150) and (max-height: 200)': {
        a: 2,
      }
    };
    expect(mq.process(obj)).toEqual({a: 1});
  });

  it('should process orientation', function () {
    const obj = {
      '@media (orientation: landscape)': {
        a: 1,
      },
      '@media (orientation: portrait)': {
        a: 2,
      }
    };
    expect(mq.process(obj)).toEqual({a: 1});
  });

  it('should process type', function () {
    const obj = {
      '@media ios': {
        a: 1,
      },
      '@media android': {
        a: 2,
      }
    };
    expect(mq.process(obj)).toEqual({a: 1});
  });

});
