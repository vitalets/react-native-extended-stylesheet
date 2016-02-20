
import rem from '../rem';

describe('rem', function () {
  it('should detect rem', function () {
    expect(rem.isRem('2rem')).toBe(true);
    expect(rem.isRem('abc-em')).toBe(false);
  });
  it('should calc rem-string', function () {
    expect(rem.calc('1.5rem', 10)).toBe(15);
    expect(rem.calc('rem', 10)).toBe(10);
  });
  it('should throw error for invalid koef', function () {
    expect(() => {rem.calc('abcrem', 10);}).toThrowError('Invalid rem value: abcrem');
  });
});
