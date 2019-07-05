import Api from '../api';

describe('EStyleSheet API', function () {

  let api;

  beforeEach(function () {
    api = new Api();
  });

  describe('build', function () {
    it('should calc stylesheet, created before build()', function () {
      const styles = api.create({
        $a: 1,
        $d: '$c',
        text: {
          $b: '1',
          fontSize: '$a',
          color: '$c',
        }
      });

      expect(styles).toEqual({});

      api.build({$c: 3});

      expect(styles).toEqual({
        $a: 1,
        $d: 3,
        _text: {
          $b: '1',
          fontSize: 1,
          color: 3,
        },
        text: 0,
      });
    });

    it('should calc stylesheet, created after build()', function () {
      api.build({$c: 3});
      const styles = api.create({
        $b: '$c',
        button: {
          color: '$c',
        }
      });
      expect(styles).toEqual({
        $b: 3,
        _button: {
          color: 3,
        },
        button: 0,
      });
    });

    it('should calculate global vars', function () {
      api.build({$c: '$d+1', $d: 2});
      const styles = api.create({$b: '$c'});
      expect(styles).toEqual({$b: 3});
    });

    it('should throw for incorrect global vars', function () {
      const fn = () => api.build({a: 1});
      expect(fn).toThrowError(
        `EStyleSheet.build() params should contain global variables (start with $) ` +
        `or media queries (start with @media). Got 'a'.`
      );
    });

    it('should use media-queries on global vars', function () {
      jest.setMock('react-native', {
        Platform: {
          OS: 'ios'
        }
      });
      api.build({
        $a: 1,
        '@media ios': {
          $a: 2,
        },
        '@media android': {
          $a: 3,
        }
      });
      const styles = api.create({$b: '$a'});
      expect(styles).toEqual({$b: 2});
    });

    it('styles should have prototype chain (#101)', function () {
      api.build();
      const styles = api.create({foo: 'bar'});
      expect(typeof styles.hasOwnProperty).toEqual('function');
    });
  });

  describe('re-build', function () {

    const rawStyles = {
      $a: 1,
      $d: '$c',
      text: {
        $b: '1',
        fontSize: '$a',
        color: '$c',
      }
    };

    const resultStyles = {
      $a: 1,
      $d: 3,
      _text: {
        $b: '1',
        fontSize: 1,
        color: 3,
      },
      text: 0,
    };

    it('should re-calculate styles, created before rebuild', function () {
      const styles = api.create(rawStyles);
      api.build({$c: 1, $theme: 'foo'});
      api.build({$c: 3, $theme: 'bar'});
      expect(styles).toEqual(resultStyles);
    });

    it('should re-calculate styles, created between rebuild', function () {
      api.build({$c: 1, $theme: 'foo'});
      const styles = api.create(rawStyles);
      api.build({$c: 3, $theme: 'bar'});
      expect(styles).toEqual(resultStyles);
    });

    it('should re-calculate styles, created after rebuild', function () {
      api.build({$c: 1, $theme: 'foo'});
      api.build({$c: 3, $theme: 'bar'});
      const styles = api.create(rawStyles);
      expect(styles).toEqual(resultStyles);
    });

    it('should not re-calculate styles for the same theme', function () {
      const styles = api.create(rawStyles);
      api.build({$c: 3, $theme: 'foo'});
      api.build({$c: 1, $theme: 'foo'});
      expect(styles).toEqual(resultStyles);
    });

    it('should not re-calculate styles for default theme', function () {
      const styles = api.create(rawStyles);
      api.build({$c: 3});
      api.build({$c: 1});
      expect(styles).toEqual(resultStyles);
    });

    it('should re-calculate styles after clearCache', function () {
      const styles = api.create(rawStyles);
      api.build({$c: 1});
      api.clearCache();
      api.build({$c: 3});
      expect(styles).toEqual(resultStyles);
    });
  });

  describe('value', function () {
    it('should calculate values as string', function () {
      api.build({$d: 1});
      const res1 = api.value('$d+1');
      const res2 = api.value('100% - 10', 'width');
      expect(res1).toBe(2);
      expect(res2).toBe(90);
    });

    it('should calc value inside style as a function', function () {
      api.build({
        $defaultText: {
          fontSize: 1
        }
      });
      const styles = api.create({
        text: () => api.value('$defaultText')
      });
      expect(styles).toEqual({
        _text: {
          fontSize: 1
        },
        text: 0
      });
    });
  });

  describe('child', function () {
    it('should export child method', function () {
      expect(typeof api.child).toBe('function');
    });
  });

  describe('subscribe', function () {
    it('should call listener, created before build', function () {
      const listener = jest.fn();
      api.subscribe('build', listener);
      api.build();
      expect(listener.mock.calls.length).toBe(1);
    });

    it('should call listener, created after build', function () {
      const listener = jest.fn();
      api.build();
      api.subscribe('build', listener);
      expect(listener.mock.calls.length).toBe(1);
    });

    it('re-build: call listener attached before first build', function () {
      const listener = jest.fn();
      api.subscribe('build', listener);
      api.build();
      api.build();
      expect(listener.mock.calls.length).toBe(2);
    });

    it('re-build: call listener attached after first build (#109)', function () {
      const listener = jest.fn();
      api.build();
      api.subscribe('build', listener);
      api.build();
      expect(listener.mock.calls.length).toBe(2);
    });

    it('should throw error when subscribe to incorrect event', function () {
      const fn = () => api.subscribe('abc', () => {
      });
      expect(fn).toThrowError('Only \'build\' event is currently supported.');
    });

    it('should throw error when subscribe with non-function listener', function () {
      const fn = () => api.subscribe('build', null);
      expect(fn).toThrowError('Listener should be a function.');
    });
  });

  describe('unsubscribe', function () {
    it('should not call listener after unsubscribe', function () {
      const listener = jest.fn();
      api.subscribe('build', listener);
      api.unsubscribe('build', listener);
      api.build();
      expect(listener.mock.calls.length).toBe(0);
    });

    it('should throw error when unsubscribe with non-function listener', function () {
      const fn = () => api.unsubscribe('build', null);
      expect(fn).toThrowError('Listener should be a function.');
    });
  });

  describe('original StyleSheet', function () {
    it('should proxy calls to original StyleSheet', function () {
      // real StyleSheet flatten() accepts style IDs, not objects
      const obj = api.flatten([{x: 1}, {y: 2}]);
      expect(obj).toEqual({x: 1, y: 2});
    });

    it('should return props of original StyleSheet', function () {
      expect(api.hairlineWidth).toEqual(1);
    });
  });

});
