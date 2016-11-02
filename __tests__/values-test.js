var ValueLiteral = require('../js/value_literal.js');
var ValueColumn = require('../js/value_column.js');
require('../test-env/TestPrototype.js')();

describe('ValueLiteral', function() {
  it('prints out the valid js', function() {
    for (var i = 0; i < 100; i++) {
      var literal = new ValueLiteral("" + i);
      var res = eval(literal.toJS());
      expect(res).toBe(i + '');
    }
  });
});

describe('ValueColumn', function() {
  it('prints out the valid js', function() {
    var currentRow = {};
    for (var i = 0; i < 100; i++) {
      var column = 'Column' + i;
      currentRow[column] = column;
      var value = new ValueColumn(column);
      var res = eval(value.toJS());
      expect(res).toBe(column);
    }
  });
});
