import EStyleSheet from '../index';

describe('EStyleSheet', function() {

  beforeEach(function () {
    EStyleSheet.reset();
  });

  it('should create stylesheets and fill after build', function() {
    let res1 = EStyleSheet.create({
      $a: 1,
      text: {
        $b: '1',
        fontSize: '$a',
      }
    });
    let res2 = EStyleSheet.create({
      $b: '$c',
      button: {
        color: '$c',
      }
    });

    expect(res1).toEqual({});
    expect(res2).toEqual({});

    EStyleSheet.build({c: 3});

    expect(res1).toEqual({
      $a: 1,
      _text: {
        $b: '1',
        fontSize: 1,
      },
      text: 0,
    });
    expect(res2).toEqual({
      $b: 3,
      _button: {
        color: 3,
      },
      button: 0,
    });
  });

  it('should create calculated stylesheets after build', function() {
    EStyleSheet.build({c: 3});
    let res = EStyleSheet.create({
      $b: '$c',
      button: {
        color: '$c',
      }
    });
    expect(res).toEqual({
      $b: 3,
      _button: {
        color: 3,
      },
      button: 0,
    });
  });

  it('should calculate global vars', function() {
    EStyleSheet.build({c: '$d+1', d: 2});
    let res = EStyleSheet.create({
      $b: '$c',
    });
    expect(res).toEqual({
      $b: 3,
    });
  });

  it('should throw error on second `build` call', function() {
    EStyleSheet.build();
    expect(() => EStyleSheet.build()).toThrowError('No need to call `EStyleSheet.build()` more than once');
  });

  it('should calculate value', function() {
    EStyleSheet.build({d: 1});
    let res1 = EStyleSheet.value('$d+1');
    let res2 = EStyleSheet.value('100% - 10', 'width');
    expect(res1).toBe(2);
    expect(res2).toBe(90);
  });

  it('should export memoize method', function() {
    expect(typeof EStyleSheet.memoize).toBe('function');
  });

  it('should export child method', function() {
    expect(typeof EStyleSheet.child).toBe('function');
  });
});
