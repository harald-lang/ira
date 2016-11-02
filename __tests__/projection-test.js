var DataRelation = require('../js/data_relation.js');
var Projection = require('../js/expression_projection.js');
var createIntColumns = require('../test-env/createIntColumns.js');
var createData = require('../test-env/createData.js');
require('../test-env/TestPrototype.js')();

var createRelation = function(noOfCol,noOfRows,extraColumns) {
  var columns = createIntColumns(noOfCol).concat(extraColumns);
  var data = createData(noOfRows,columns.length);
  return new DataRelation("Data",columns,data);
};

var testEverything = function(res,data) {
  it('holds the right result', function() {
    for (var i = 0; i < res.length; i++) {
      var row1 = res[i];
      var row2 = data[i];
      var k = row2.length-1;
      for (var j = row1.length-1; j >= 0; j--) {
        expect(row1[j]).toBe(row2[k]);
        k--;
      }
    }
  });
};

var testColumns = function(resCol,extraColumns) {
  it('has the exact columns', function() {
    for (var i = 0; i < resCol.length; i++) {
      expect(resCol[i]).toBe(extraColumns[i]);
    }
  });
};

describe('Projection', function() {
  var reduce = function(r,i) {
    return r + i + ",";
  };
  for (var i = 0; i < 10; i++) {
    var noOfCol = Math.floor(Math.random() * 20 + 1);
    var noOfRows = Math.floor(Math.random() * 20 + 1);
    var noOfExtra = Math.floor(Math.random() * 20 + 1);
    var extraColumns = createIntColumns(noOfExtra).map(function(x) { return "Extra" + x;});
    var rel = createRelation(noOfCol,noOfRows,extraColumns);
    var columns = extraColumns.reduce(reduce,"");
    columns = columns.substring(0,columns.length-1);
    var proj = new Projection(columns,rel);
    var resCol = proj.getColumns();
    testColumns(resCol,extraColumns);
    var res = proj.getResult();
    var data = rel.getResult();
    testEverything(res,data);
  }
});
