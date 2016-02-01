
import style from '../style';

describe('style', function() {

  it('should calc style', function() {
    let source = {
      $a: 1,
      $b: '$d',
      fontSize: '$a',
      borderWidth: '$b',
      propAndroid: 1,
      propIOS: 2,
      color: '$e',
    };
    let varsArr = [{$a: 3, $d: 3, $e: 'abc'}];

    let res = style.calc(source, varsArr);

    expect(res).toEqual({
      calculatedVars: {
        $a: 1,
        $b: 3,
      },
      calculatedStyles: {
        fontSize: 1,
        borderWidth: 3,
        prop: 2,
        color: 'abc',
      }
    });
  });

  it('should throw error on cyclic refs', function() {
    let source = {
      $a: '$b',
      $b: '$a',
    };
    expect(() => style.calc(source)).toThrowError('Cyclic reference: $b -> $a -> $b');
  });

  it('should apply scale inlined', function() {
    let source = {
      $scale: 2,
      $b: '$d',
      fontSize: '$a',
      borderWidth: '$b',
      prop: 1,
      width: 2,
    };
    let varsArr = [{$a: 2, $d: 3}];

    let res = style.calc(source, varsArr);

    expect(res).toEqual({
      calculatedVars: {
        $scale: 2,
        $b: 3,
      },
      calculatedStyles: {
        fontSize: 4,
        borderWidth: 6,
        prop: 1,
        width: 4,
      }
    });
  });

  it('should apply scale from vars', function() {
    let source = {
      $b: '$d',
      $width: 1,
      fontSize: '$a',
      borderWidth: '$b',
      prop: '$width',
      width: '$width',
    };
    let varsArr = [{$a: 2, $d: 3}, {$scale: 2}];

    let res = style.calc(source, varsArr);
    expect(res).toEqual({
      calculatedVars: {
        $width: 1,
        $b: 3,
      },
      calculatedStyles: {
        fontSize: 4,
        borderWidth: 6,
        prop: 1,
        width: 2,
      }
    });
  });
});
