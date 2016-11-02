var DataRelation = require('../js/data_relation.js');
var Minus = require('../js/expression_minus.js');
var createIntColumns = require('../test-env/createIntColumns.js');
var createColumns = require('../test-env/createColumns.js');
var createData = require('../test-env/createData.js');
require('../test-env/TestPrototype.js')();

describe('Minus', function() {

  var assertionsSingle = function(minus) {
    it('deletes every item', function() {
      var res = minus.getResult();
      expect(res.length).toBe(0);
    });
  };

  var onlyDeletesDuplicates = function(minus,original) {
    var res = minus.getResult();
    it('has the exact number of results', function() {
      expect(res.length).toBe(original.length);
    });
    it('has the exact same results', function() {
      for (var i = 0; i < original.length; i++) {
        expect(res[i]).toBe(original[i]);
      }
    });
  };

  for (var i = 0; i < 10; i++) {
    var noOfCol = Math.floor(Math.random() * 100) + 1;
    var noOfRows = Math.floor(Math.random() * 100) + 1;
    var columns = createColumns(noOfCol);
    var itemsInRelation = createData(noOfCol,noOfRows);
    var relationOne = new DataRelation("DataOne",columns,itemsInRelation);
    var relationTwo = new DataRelation("DataTwo",columns,itemsInRelation);
    var minus = new Minus(relationOne,relationTwo);
    assertionsSingle(minus);
    var itemsInRelationTwo = createData(noOfCol,noOfRows);
    var itemsInRelationOne = itemsInRelation.concat(itemsInRelationTwo);
    relationOne = new DataRelation("DataOne",columns,itemsInRelationOne);
    relationTwo = new DataRelation("DataTwo",columns,itemsInRelationTwo);
    minus = new Minus(relationOne,relationTwo);
    onlyDeletesDuplicates(minus,itemsInRelation);
  }

});
