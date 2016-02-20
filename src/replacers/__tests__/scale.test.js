
import scale from '../scale';

describe('scale', function () {

  it('should detect scale', function () {
    expect(scale.isScalable(1)).toBe(false);
    expect(scale.isScalable(1, 'prop')).toBe(false);
    expect(scale.isScalable(1, 'width')).toBe(true);
    expect(scale.isScalable(1, 'propWidth')).toBe(true);
  });

  it('should calc scale', function () {
    expect(scale.calc(2, 2)).toBe(4);
    expect(scale.calc(1, 0.5)).toBe(0.5);
  });

});
