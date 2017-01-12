import memoize from '../memoize';

describe('memoize', function () {

  it('should cache calls with the same args', function () {
    let f = jest.fn().mockImplementation((a, b) => a + b);
    let mf = memoize(f);
    let res = mf(1, 2);
    let res2 = mf(1, 2);
    let res3 = mf(1, 3);

    expect(res).toBe(3);
    expect(res2).toBe(3);
    expect(res3).toBe(4);
    expect(f.mock.calls.length).toBe(2);
  });

});
