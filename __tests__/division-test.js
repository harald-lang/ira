var DataRelation = require('../js/data_relation.js');
var Division = require('../js/expression_division.js');
var Crossproduct = require('../js/expression_crossproduct.js');
var createIntColumns = require('../test-env/createIntColumns.js');
var createColumns = require('../test-env/createColumns.js');
var createData = require('../test-env/createData.js');
require('../test-env/TestPrototype.js')();

describe('Division', function() {

  var testData = function(div, original) {
    var res = div.getResult();
    it('has the exact number of results', function() {
      expect(res.length).toBe(original.length);
    });
    it('has the exact results', function() {
      for (var i = 0; i < original.length; i++) {
        for (var j = 0; j < res[i].length; j++) {
          expect(res[i][j]).toBe(original[i][j]);
        }
      }
    });
  };

  for (var i = 0; i < 10; i++) {
    var noOfCol = Math.floor(Math.random() * 20) + 1;
    var noOfRows = Math.floor(Math.random() * 20) + 1;
    var commonRows = Math.floor(Math.random() * 20) + 1;
    var otherRows = Math.floor(Math.random() * 20) + 1;
    var allRows = createData(noOfRows,noOfCol+1);
    var columns = createColumns(noOfCol);
    var keptRows = createData(commonRows,noOfCol);
    var r = new DataRelation("Data",columns,keptRows);
    var other = new DataRelation("Other",["Common"],createData(otherRows,1));
    var allPairs = new Crossproduct(r,other);
    var res = allPairs.getResult();
    allRows = allRows.concat(res);
    columns.push("Common");
    var rel = new DataRelation("Data",columns,allRows);
    var div = new Division(rel,other);
    testData(div, keptRows);
  }

});
