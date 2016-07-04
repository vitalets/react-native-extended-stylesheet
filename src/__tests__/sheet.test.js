
import Sheet from '../sheet';

describe('sheet', function () {
  it('should calc sheet', function () {
    const source = {
      $a: 1,
      $b: '$a + 1',
      text: {
        $c: '$a',
        fontSize: 10,
        borderWidth: '$b',
        prop: '$e',
      }
    };
    const variables = {$a: 2, $d: 2, $e: 'abc'};
    const result = new Sheet(source).calc(variables);
    expect(result).toEqual({
      $a: 1,
      $b: 2,
      _text: {
        $c: 1,
        fontSize: 10,
        borderWidth: 2,
        prop: 'abc',
      },
      text: 0,
    });
  });

  it('should calc underscored props', function () {
    const source = {
      $b: 2,
      _text: {
        borderWidth: '$b',
      }
    };
    const result = new Sheet(source).calc();
    expect(result).toEqual({
      $b: 2,
      _text: {
        borderWidth: 2,
      }
    });
  });

  it('should support media queries', function () {
    const source = {
      $b: 2,
      '@media ios': {
        $b: 3
      },
      button: {
        prop: 2,
        '@media ios': {
          prop: '$b'
        },
      }
    };
    const result = new Sheet(source).calc();
    expect(result).toEqual({
      $b: 3,
      _button: {
        prop: 3,
      },
      button: 0,
    });
  });
  // todo
  /*
  it('should clean media-queried props on re-calc', function () {
    const source = {
      $b: 2,
      '@media ios': {
        $b: 3
      },
      button: {
        prop: 2,
        '@media ios': {
          prop: '$b'
        },
      }
    };
    const result = new Sheet(source).calc();
    expect(result).toEqual({
      $b: 3,
      _button: {
        prop: 3,
      },
      button: 0,
    });
  });
  */
});
