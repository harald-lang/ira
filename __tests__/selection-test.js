var DataRelation = require('../js/data_relation.js');
var Selection = require('../js/selection.js');
var createIntColumns = require('../test-env/createIntColumns.js');
var createColumns = require('../test-env/createColumns.js');
var createData = require('../test-env/createData.js');
require('../test-env/TestPrototype.js')();

describe('Division', function() {
  var testData = function(select, original,number) {
    var res = select.getResult();
    it('has the exact number of results', function() {
      expect(res.length).toBe(number);
    });
    it('has the exact results', function() {
      for (var i = 0; i < number; i++) {
        for (var j = 0; j < res[i].length; j++) {
          expect(res[i][j]).toBe(original[i][j]);
        }
      }
    });
  };

  for (var i = 0; i < 10; i++) {
    var noOfCol = Math.floor(Math.random() * 20) + 1;
    var noOfRows = Math.floor(Math.random() * 20) + 1;
    var noOfRes = Math.min(i,noOfRows);
    var rows = createData(noOfRows,noOfCol+1);
    for (var i = 0; i < noOfRes; i++) {
      rows[i][noOfCol] = "Data";
    }
    var columns = createColumns(noOfCol);
    columns.push("Data");
    var r = new DataRelation("Data",columns,rows);
    var cond = {
      toJS: function() {
        return "currentRow.Data == \"Data\"";
      }
    };
    var select = new Selection(cond,r);
    testData(select,rows,noOfRes);
  }
});
