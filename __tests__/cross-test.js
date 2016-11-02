var DataRelation = require('../js/data_relation.js');
var Crossproduct = require('../js/expression_crossproduct.js');
var createIntColumns = require('../test-env/createIntColumns.js');
var createFloatColumns = require('../test-env/createFloatColumns.js');
var createData = require('../test-env/createData.js');
require('../test-env/TestPrototype.js')();

var createRelation = function(noOfCol,noOfRows,ints,name) {
  var columns = ints ? createIntColumns(noOfCol) : createFloatColumns(noOfCol);
  var data = createData(noOfRows,noOfCol);
  return new DataRelation(name,columns,data);
};

describe('Crossproduct', function() {
  var noOfRows = 0;
  var noOfCol = 0;
  var cross = null;
  var assert = function() {
    expect(cross.getResult().length).toBe(noOfRows*noOfRows);
    expect(cross.getColumns().length).toBe(noOfCol*2);
  };
  var testResult = function(res,rel1,rel2) {
    it('has the correct result', function() {
      var counter = 0;
      for (var i = 0; i < rel1.length; i++) {
        for (var j = 0; j < rel2.length; j++) {
          var row = rel1[i].concat(rel2[j]);
          var resultRow = res[counter];
          counter++;
          expect(resultRow.length).toBe(row.length);
          for (var k = 0; k < resultRow.length; k++) {
            expect(resultRow[k]).toBe(row[k]);
          }
        }
      }
    });
  };
  for (var i = 0; i < 10; i++) {
    noOfCol = Math.floor(Math.random() * 20 + 1);
    noOfRows = Math.floor(Math.random() * 20 + 1);
    var rel1 = createRelation(noOfCol,noOfRows,true,"One");
    var rel2 = createRelation(noOfCol,noOfRows,false,"Two");
    cross = new Crossproduct(rel1,rel2);
    it('has the correct number of rows and columns', assert);
    testResult(cross.getResult(),rel1.getResult(),rel2.getResult());
  }
});
