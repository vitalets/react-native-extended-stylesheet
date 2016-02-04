
import globalVars from '../global-vars';

describe('globalVars', function() {

  beforeEach(function () {
    globalVars.clear();
  });

  it('should return null before set', function () {
    expect(globalVars.get()).toEqual(null);
  });

  it('should set and return vars', function () {
    let gVars = {
      d: 2,
      b: '$d',
      c: 'abc',
    };

    globalVars.set(gVars);

    expect(globalVars.get()).toEqual({
      $d: 2,
      $b: 2,
      $c: 'abc',
    });
  });

});
