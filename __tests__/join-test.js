var DataRelation = require('../js/data_relation.js');
var Join = require('../js/expression_join.js');
var createIntColumns = require('../test-env/createIntColumns.js');
var createFloatColumns = require('../test-env/createFloatColumns.js');
var createData = require('../test-env/createData.js');
require('../test-env/TestPrototype.js')();

var createRelation = function(noOfCol,noOfRows,ints,noOfPairs) {
  var columns = ints ? createIntColumns(noOfCol) : createFloatColumns(noOfCol);
  columns.push("CommonColumn");
  var data = createData(noOfRows,noOfCol+1);
  for (var i = 0; i < Math.min(noOfRows,noOfPairs); i++) {
    data[i][columns.length-1] = i + "Common";
  }
  return new DataRelation("Data",columns,data);
};

describe('Join Result', function() {
  var noOfPairs = 0;
  var join = null;
  var assert = function() {
    expect(join.getResult().length).toBe(noOfPairs);
  };
  for (var i = 0; i < 10; i++) {
    var noOfCol = Math.floor(Math.random() * 20 + 1);
    var noOfRows = Math.floor(Math.random() * 20 + 1);
    noOfPairs = Math.min(i,noOfRows);
    var rel1 = createRelation(noOfCol,noOfRows,true,noOfPairs);
    var rel2 = createRelation(noOfCol,noOfRows,false,noOfPairs);
    join = new Join(rel1,rel2);
    it('has exactly the expected amount of results', assert);
  }
});
