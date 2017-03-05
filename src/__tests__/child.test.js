import child from '../child';

describe('child', function () {

  it(':first-child', function () {
    let styles = {
      a: {
        x: 1
      },
      'a:first-child':  {
        x: 2,
        y: 1,
      },
    };
    expect(child(styles, 'a', 0, 5)).toEqual([{x: 1}, {x: 2, y: 1}]);
  });

  it(':nth-child-even', function () {
    let styles = {
      a: {
        x: 1
      },
      'a:nth-child-even':  {
        x: 2,
        y: 1,
      },
    };
    expect(child(styles, 'a', 2, 5)).toEqual([{x: 1}, {x: 2, y: 1}]);
  });

  it(':nth-child-odd', function () {
    let styles = {
      a: {
        x: 1
      },
      'a:nth-child-odd':  {
        x: 2,
        y: 1,
      },
    };
    expect(child(styles, 'a', 1, 5)).toEqual([{x: 1}, {x: 2, y: 1}]);
  });

  it(':last-child', function () {
    let styles = {
      a: {
        x: 1
      },
      'a:last-child':  {
        x: 2,
        y: 1,
      },
    };
    expect(child(styles, 'a', 4, 5)).toEqual([{x: 1}, {x: 2, y: 1}]);
  });

  it('no pseudo', function () {
    let styles = {
      a: {
        x: 1
      },
    };
    expect(child(styles, 'a', 0, 5)).toEqual({x: 1});
  });

  it('non-existent style', function () {
    let styles = {
      a: {
        x: 1
      },
      'a:first-child':  {
        x: 2,
        y: 1,
      },
    };
    expect(child(styles, 'b', 0, 5)).toEqual(undefined);
  });


  it(':first-child + :nth-child-even', function () {
    let styles = {
      a: {
        x: 1
      },
      'a:first-child':  {
        x: 2,
        y: 1,
      },
      'a:nth-child-even':  {
        x: 3,
        z: 1,
      },
    };
    expect(child(styles, 'a', 0, 5)).toEqual([{x: 1}, {x: 2, y: 1}, {x: 3, z: 1}]);
  });

});
