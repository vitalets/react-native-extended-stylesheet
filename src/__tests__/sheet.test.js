
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
    const sheet = new Sheet(source);

    sheet.calc(variables);

    const result = sheet.getResult();
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
    const sheet = new Sheet(source);

    sheet.calc();

    const result = sheet.getResult();
    expect(result).toEqual({
      $b: 2,
      _text: {
        borderWidth: 2,
      }
    });
  });

});
