import vars from '../vars';

describe('vars', function () {
  it('should detect var', function () {
    expect(vars.isVar('$abc')).toBe(true);
    expect(vars.isVar('abc')).toBe(false);
  });

  it('should calc var', function () {
    expect(vars.calc('$abc', [{$abc: 1}])).toBe(1);
    expect(() => vars.calc('$abc', [])).toThrowError('Unresolved variable: $abc');
    expect(() => vars.calc('abc', [{$abc: 1}])).toThrowError('Unresolved variable: abc');
  });

  it('should take first var from varsArr', function () {
    expect(vars.calc('$abc', [{$abc: 1}, {$abc: 2}])).toBe(1);
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
      $a: 1,
      $b: 2
    });
  });

  it('should get var', function () {
    expect(vars.get('$abc', [{$abc: 1}, {$abc: 2}])).toBe(1);
    expect(vars.get('abc', [])).toBe(undefined);
    expect(() => vars.get('abc')).toThrowError('You should pass vars array to vars.get()');
  });

  it('should get object properties using path', function () {
    const obj = {
      $abc: {
        foo: 'foo',
        bar: {
          color: '#FF',
        },
      },
    };

    expect(vars.get('$abc.foo', [obj])).toBe('foo');
    expect(vars.get('$abc.bar.color', [obj])).toBe('#FF');
    expect(vars.get('$abc.bar.color2', [obj])).toBe(undefined);
    expect(vars.get('$abc.bar1.color', [obj])).toBe(undefined);
  });

  it('should get object array values using path', function () {
    const obj = {
      $abc: {
        foo: [1, 2],
        bar: [{
          value: 'bar',
        }],
      },
    };

    expect(vars.get('$abc.foo[0]', [obj])).toBe(1);
    expect(vars.get('$abc.bar[0].value', [obj])).toBe('bar');
    expect(vars.get('$abc.foo[20]', [obj])).toBe(undefined);
    expect(vars.get('$abc.unk[10]', [obj])).toBe(undefined);
  });
});
