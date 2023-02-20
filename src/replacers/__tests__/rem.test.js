
import {PixelRatio} from 'react-native';

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
  it('should calc rem-string with pixel ratio 1.5', () => {
    PixelRatio.get.mockReturnValueOnce(1.5);
    expect(rem.calc('18rem', 1.104)).toBe(19.666666666666668);
  });
  it('should calc rem-string with pixel ratio 2', () => {
    PixelRatio.get.mockReturnValueOnce(2);
    expect(rem.calc('18rem', 1.104)).toBe(20);
  });
  it('should calc rem-string with pixel ratio 3', () => {
    PixelRatio.get.mockReturnValueOnce(3);
    expect(rem.calc('18rem', 1.104)).toBe(20);
  });
  it('should calc rem-string with pixel ratio 3.5', () => {
    PixelRatio.get.mockReturnValueOnce(3.5);
    expect(rem.calc('18rem', 1.104)).toBe(19.857142857142858);
  });
  it('should throw error for invalid koef', function () {
    expect(() => {rem.calc('abcrem', 10);}).toThrowError('Invalid rem value: abcrem');
  });
});
