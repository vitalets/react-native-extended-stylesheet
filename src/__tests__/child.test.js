import child from '../child';

describe('child', function () {

  it('should apply pseudo classes', function () {
    let styles = {
      a: 1,
      'a:first-child': 2,
      'a:nth-child-even': 3,
      'a:nth-child-odd': 4,
      'a:last-child': 5,
    };
    expect(child(styles, 'a')).toEqual(1);
    expect(child(styles, 'a', 0, 5)).toEqual([1, 2, 3]);
    expect(child(styles, 'a', 1, 5)).toEqual([1, 4]);
    expect(child(styles, 'a', 2, 5)).toEqual([1, 3]);
    expect(child(styles, 'a', 4, 5)).toEqual([1, 3, 5]);
    expect(child(styles, 'a', 5, 6)).toEqual([1, 4, 5]);
    expect(child(styles, 'a', 6, 6)).toEqual(1);
    expect(child(styles, 'b', 1, 5)).toEqual(undefined);
  });

});
