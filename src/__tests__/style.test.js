
import Style from '../style';

describe('style', function () {

  it('should calc style', function () {
    let source = {
      $a: 1,
      $b: '$d',
      fontSize: '$a',
      borderWidth: '$b',
      color: '$e',
    };
    let varsArr = [{$a: 3, $d: 3, $e: 'abc'}];

    let res = new Style(source, varsArr).calc();

    expect(res).toEqual({
      calculatedVars: {
        $a: 1,
        $b: 3,
      },
      calculatedProps: {
        fontSize: 1,
        borderWidth: 3,
        color: 'abc',
      }
    });
  });

  it('should passthough array props (#103)', function () {
    const source = {
      transform: [{ rotate: '45deg' }]
    };

    const res = new Style(source, []).calc();

    expect(res).toEqual({
      calculatedVars: null,
      calculatedProps: {
        transform: [{ rotate: '45deg' }]
      }
    });
  });

  it('should throw error on cyclic refs', function () {
    let source = {
      $a: '$b',
      $b: '$a',
    };
    expect(() => new Style(source).calc()).toThrowError('Cyclic reference: $b -> $a -> $b');
  });

  it('should apply scale inlined', function () {
    let source = {
      $scale: 2,
      $b: '$d',
      fontSize: '$a',
      borderWidth: '$b',
      prop: 1,
      width: 2,
    };
    let varsArr = [{$a: 2, $d: 3}];

    let res = new Style(source, varsArr).calc();

    expect(res).toEqual({
      calculatedVars: {
        $scale: 2,
        $b: 3,
      },
      calculatedProps: {
        fontSize: 4,
        borderWidth: 6,
        prop: 1,
        width: 4,
      }
    });
  });

  it('should apply scale from vars', function () {
    let source = {
      $b: '$d',
      $width: 1,
      fontSize: '$a',
      borderWidth: '$b',
      prop: '$width',
      width: '$width',
    };
    let varsArr = [{$a: 2, $d: 3}, {$scale: 2}];

    let res = new Style(source, varsArr).calc();

    expect(res).toEqual({
      calculatedVars: {
        $width: 1,
        $b: 3,
      },
      calculatedProps: {
        fontSize: 4,
        borderWidth: 6,
        prop: 1,
        width: 2,
      }
    });
  });

  it('should outline', function () {
    let source = {
      prop: 10,
    };
    let varsArr = [{$outline: true}, {}];
    Math.random = jest.fn().mockReturnValue(0);

    let res = new Style(source, varsArr).calc();

    expect(res).toEqual({
      calculatedVars: null,
      calculatedProps: {
        prop: 10,
        borderWidth: 1,
        borderColor: 'black',
      }
    });
    expect(Math.random.mock.calls.length).toBe(1);
  });

  it('should support media queries', function () {
    const source = {
      $b: 2,
      c: 1,
      '@media ios': {
        $b: 3,
        c: '$b',
      }
    };
    const result = new Style(source).calc();
    expect(result).toEqual({
      calculatedVars: {
        $b: 3,
      },
      calculatedProps: {
        c: 3,
      }
    });
  });

  describe('nested props (#99)', function () {
    it('should calc nested style props (#99)', function () {
      const source = {
        shadowOffset: {
          width: '$width',
          foo: 'bar'
        }
      };

      const varsArr = [{$width: 100, $height: 200}];

      const styles = new Style(source, varsArr).calc();

      expect(styles).toEqual({
        calculatedVars: null,
        calculatedProps: {
          shadowOffset: {
            width: 100,
            foo: 'bar'
          }
        }
      });
    });

    it('should support media queries', function () {
      const source = {
        shadowOffset: {
          width: '$width',
          foo: 'bar'
        },
        '@media ios': {
          shadowOffset: {
            width: 1,
            height: '$height'
          },
        }
      };

      const varsArr = [{$width: 100, $height: 200}];

      const styles = new Style(source, varsArr).calc();

      expect(styles).toEqual({
        calculatedVars: null,
        calculatedProps: {
          shadowOffset: {
            width: 1,
            foo: 'bar',
            height: 200,
          }
        }
      });
    });

  });

});
