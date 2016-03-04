
import Value from '../value';

const varsArr = [
  {
    $a: 1,
    $b: 2,
  },
  {
    $a: 2,
    $c: 3,
    $e: 'abc',
    $d: {x: 1}
  }
];

describe('value', function() {

  it('should keep values without transform', function() {
    expect(new Value(10, 'prop', varsArr).calc()).toEqual(10);
    expect(new Value('10', 'prop', varsArr).calc()).toEqual('10');
    expect(new Value('abc', 'prop', varsArr).calc()).toEqual('abc');
    expect(new Value([], 'prop', varsArr).calc()).toEqual([]);
    expect(new Value({x: 1}, 'prop', varsArr).calc()).toEqual({x: 1});
    expect(new Value(null, 'prop', varsArr).calc()).toEqual(null);
  });

  it('should keep justifyContent values', function() {
    ['flex-start', 'flex-end', 'space-around', 'space-between'].map((value) => {
      expect(new Value(value, 'prop', varsArr).calc()).toEqual(value);
    });
  });

  it('should calc var', function() {
    expect(new Value('$a', 'prop', varsArr).calc()).toEqual(1);
    expect(new Value('$b', 'prop', varsArr).calc()).toEqual(2);
    expect(new Value('$e', 'prop', varsArr).calc()).toEqual('abc');
    expect(new Value('$d', 'prop', varsArr).calc()).toEqual({x: 1});
    expect(() => new Value('$xxx', 'prop', varsArr).calc()).toThrowError('Unresolved variable: $xxx');
  });

  it('should calc percent', function() {
    expect(new Value('50%', 'width', varsArr).calc()).toEqual(50);
    expect(new Value('100%', 'height', varsArr).calc()).toEqual(200);
  });

  it('should calc rem', function() {
    expect(new Value('0.5rem', 'prop', varsArr).calc()).toEqual(8);
    expect(new Value('rem', 'prop', varsArr).calc()).toEqual(16);
  });

  it('should calc operations', function() {
    expect(new Value('$a + 0.5rem', 'prop', varsArr).calc()).toEqual(9);
    expect(new Value('$c-$a', 'prop', varsArr).calc()).toEqual(2);
    expect(new Value('$a * rem', 'prop', varsArr).calc()).toEqual(16);
    expect(new Value('50% + 1', 'width', varsArr).calc()).toEqual(51);
  });

  it('should calc scale', function() {
    expect(new Value('0.5rem', 'propWidth', [{$scale: 3}]).calc()).toEqual(24);
    expect(new Value('0.5rem', 'prop', [{$scale: 3}]).calc()).toEqual(8);
  });

  it('should exec value as a function', function() {
    expect(new Value(() => 10, 'prop').calc()).toEqual(10);
    expect(new Value(() => '$a', 'prop', [{$a: 1}]).calc()).toEqual(1);
  });
});
