import modificator from '../modificator';

describe('modificator', function() {

  it('should return conditional style', function () {
    let styles = {a: 1};
    expect(modificator.getStyle(styles, 'a')).toBe(1);
    expect(modificator.getStyle(styles, 'a', true)).toBe(1);
    expect(modificator.getStyle(styles, 'a', false)).toBe(null);
  });

  it('should apply child modificator', function () {
    let styles = {
      a: 1,
      'a:first-child': 2,
      'a:nth-child-even': 3,
      'a:last-child': 4,
    };
    expect(modificator.getStyle(styles, 'a', 'child')).toEqual(1);
    expect(modificator.getStyle(styles, 'a', 'child', 0, 5)).toEqual([1, 2, 3]);
    expect(modificator.getStyle(styles, 'a', 'child', 1, 5)).toEqual(1);
    expect(modificator.getStyle(styles, 'a', 'child', 2, 5)).toEqual([1, 3]);
    expect(modificator.getStyle(styles, 'a', 'child', 4, 5)).toEqual([1, 3, 4]);
    expect(modificator.getStyle(styles, 'a', 'child', 5, 6)).toEqual([1, 4]);
    expect(modificator.getStyle(styles, 'a', 'child', 6, 6)).toEqual(1);
    expect(modificator.getStyle(styles, 'a', 'child123')).toEqual(1);
  });

});