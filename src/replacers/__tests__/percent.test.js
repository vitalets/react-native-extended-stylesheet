jest.dontMock('../percent');

ReactMock.Dimensions.get = () => {
  return {width: 100, height: 200};
};

const percent = require('../percent').default;

describe('percent', function() {
  it('should detect percent', function () {
    expect(percent.isPercent('10%')).toBe(true);
    expect(percent.isPercent('10')).toBe(false);
  });

  it('should calc vertical percent', function () {
    expect(percent.calc('10%', 'height')).toBe(20);
    expect(percent.calc('10%', 'Top')).toBe(20);
  });

  it('should calc horizontal percent', function () {
    expect(percent.calc('10%', 'width')).toBe(10);
    expect(percent.calc('10%', 'left')).toBe(10);
  });

  it('should throw error for invalid prop', function () {
    expect(() => percent.calc('10%', 'abc')).toThrowError([
      `Name of variable or property with percent value should contain `,
      `(height,top,bottom,vertical,width,left,right,horizontal) to define base for percent calculation`,
    ].join(''));
  });
});