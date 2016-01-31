
import Sheet from '../sheet';

describe('sheet', function() {
  it('should calc sheet', function() {
    let source = {
      $a: 1,
      $b: '$a + 1',
      text: {
        $c: '$a',
        fontSize: 10,
        borderWidth: '$b',
      }
    };
    let variables = {$a: 2, $d: 2};
    let sheet = new Sheet(source);

    sheet.calc(variables);

    let result = sheet.getResult();
    expect(result).toEqual({
      $a: 1,
      $b: 2,
      $get: result.$get,
      _text: {
        $c: 1,
        fontSize: 10,
        borderWidth: 2,
      },
      text: 0,
    });
  });

});
