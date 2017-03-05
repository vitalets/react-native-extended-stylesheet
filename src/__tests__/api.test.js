import Api from '../api';

describe('EStyleSheet API', function () {

  let api;

  beforeEach(function () {
    api = new Api();
  });

  it('should create stylesheets and fill after build', function () {
    let res1 = api.create({
      $a: 1,
      text: {
        $b: '1',
        fontSize: '$a',
      }
    });
    let res2 = api.create({
      $b: '$c',
      button: {
        color: '$c',
      }
    });

    expect(res1).toEqual({});
    expect(res2).toEqual({});

    api.build({$c: 3});

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

  it('should create calculated stylesheets after build', function () {
    api.build({$c: 3});
    let res = api.create({
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

  it('should calculate global vars after build', function () {
    api.build({$c: '$d+1', $d: 2});
    let res = api.create({
      $b: '$c',
    });
    expect(res).toEqual({
      $b: 3,
    });
  });

  it('should work correctly with several `build()` calls', function () {
    const res1 = api.create({$b: '$a'});
    api.build({$a: 1});
    const res2 = api.create({$b: '$a'});
    expect(res1).toEqual({$b: 1});
    expect(res2).toEqual({$b: 1});
    api.build({$a: 1});
    expect(res1).toEqual({$b: 1});
    expect(res2).toEqual({$b: 1});
  });

  it('should calculate value', function () {
    api.build({$d: 1});
    let res1 = api.value('$d+1');
    let res2 = api.value('100% - 10', 'width');
    expect(res1).toBe(2);
    expect(res2).toBe(90);
  });

  it('should export memoize method', function () {
    expect(typeof api.memoize).toBe('function');
  });

  it('should export child method', function () {
    expect(typeof api.child).toBe('function');
  });

  it('should subscribe to build and call listeners', function () {
    let listener1 = jest.genMockFn();
    let listener2 = jest.genMockFn();

    api.subscribe('build', listener1);
    api.build();
    api.subscribe('build', listener2);

    expect(listener1.mock.calls.length).toBe(1);
    expect(listener2.mock.calls.length).toBe(1);
  });

  it('should throw error when subscribe to incorrect event', function () {
    const fn = () => api.subscribe('abc', () => {});
    expect(fn).toThrowError('Only \'build\' event is currently supported.');
  });

  it('should throw error when subscribe with non-function listener', function () {
    const fn = () => api.subscribe('build', null);
    expect(fn).toThrowError('Listener should be a function.');
  });
});
