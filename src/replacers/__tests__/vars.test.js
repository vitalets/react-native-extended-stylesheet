
import vars from '../vars';

describe('vars', function() {
  it('should detect var', function () {
    expect(vars.isVar('$abc')).toBe(true);
    expect(vars.isVar('abc')).toBe(false);
  });

  it('should calc var', function () {
    expect(vars.calc('$abc', [{$abc: 1}])).toBe(1);
    expect(vars.calc('$abc', [{$abc: 1}, {$abc: 2}])).toBe(1);
    expect(() => vars.calc('$abc', [])).toThrowError('Unresolved variable: $abc');
    expect(() => vars.calc('abc', [{$abc: 1}])).toThrowError('Unresolved variable: abc');
  });

  it('should extract vars', function () {
    let obj = {
      $a: 1,
      $b: 2,
      c: 3,
      d: {
        $e: 1,
      }
    };
    expect(vars.extract(obj)).toEqual({
      cleanObj: {
        c: 3,
        d: {
          $e: 1,
        },
      },
      extractedVars: {
        $a: 1,
        $b: 2
      }
    });
  });

  it('should get var', function () {
    expect(vars.get('$abc', [{$abc: 1}, {$abc: 2}])).toBe(1);
    expect(vars.get('abc', [])).toBe(undefined);
  });
});
