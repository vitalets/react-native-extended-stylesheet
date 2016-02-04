
import sheetList from '../sheet-list';
import Sheet from '../sheet';

describe('sheet-list', function() {

  beforeEach(function () {
    sheetList.clear();
  });

  it('should calc all sheets', function() {
    let source = {
      $b: '$a + 1',
      text: {
        prop: '$b',
      }
    };
    let variables = {$a: 1};
    let sheet1 = new Sheet(source);
    let sheet2 = new Sheet(source);

    sheetList.add(sheet1);
    sheetList.add(sheet2);

    sheetList.calc(variables);

    expect(sheet1.getResult()).toEqual({
      $b: 2,
      _text: {
        prop: 2,
      },
      text: 0,
    });

    expect(sheet2.getResult()).toEqual({
      $b: 2,
      _text: {
        prop: 2,
      },
      text: 0,
    });
  });

});
