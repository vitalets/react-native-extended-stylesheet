// import utils from '../utils';

describe('utils', function () {

    it('should exclude by array', function () {
      expect(2).toEqual(2);
    });

  // describe('excludeKeys', function () {
  //
  //   it('should exclude by array', function () {
  //     const obj = {a: 1, b: 2};
  //     const keys = ['a', 'c'];
  //     expect(utils.excludeKeys(obj, keys)).toEqual({b: 2});
  //   });
  //
  //   it('should exclude by obj', function () {
  //     const obj = {a: 1, b: 2};
  //     const keys = {a: 2, c: 3};
  //     expect(utils.excludeKeys(obj, keys)).toEqual({b: 2});
  //   });
  //
  //   it('should work correct with empty keys', function () {
  //     const obj = {a: 1, b: 2};
  //     expect(utils.excludeKeys(obj)).toEqual(obj);
  //     expect(utils.excludeKeys(obj, null)).toEqual(obj);
  //     expect(utils.excludeKeys(obj, {})).toEqual(obj);
  //     expect(utils.excludeKeys(obj, [])).toEqual(obj);
  //   });
  // });

});
