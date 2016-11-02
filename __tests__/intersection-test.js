var DataRelation = require('../js/data_relation.js');
var Intersection = require('../js/expression_intersection.js');
var createIntColumns = require('../test-env/createIntColumns.js');
var createColumns = require('../test-env/createColumns.js');
var createData = require('../test-env/createData.js');
require('../test-env/TestPrototype.js')();

describe('Intersection', function() {

  var onlyHasDuplicates = function(inter,cross) {
    var res = inter.getResult();
    it('has the exact number of results', function() {
      expect(res.length).toBe(cross.length);
    });
    it('has the exact same results', function() {
      for (var i = 0; i < cross.length; i++) {
        expect(res[i]).toBe(cross[i]);
      }
    });
  };

  for (var i = 0; i < 10; i++) {
    var noOfCol = Math.floor(Math.random() * 100) + 1;
    var noOfRows = Math.floor(Math.random() * 100) + 1;
    var commonRows = Math.max(i, Math.floor(Math.random() * 100) + 1);
    var columns = createColumns(noOfCol);
    var itemsInRelationOne = createData(noOfCol,noOfRows);
    var itemsInRelationTwo = createData(noOfCol,noOfRows);
    var common = createData(noOfCol,commonRows);
    itemsInRelationOne = itemsInRelationOne.concat(common);
    itemsInRelationTwo = itemsInRelationTwo.concat(common);
    var relationOne = new DataRelation("DataOne",columns,itemsInRelationOne);
    var relationTwo = new DataRelation("DataTwo",columns,itemsInRelationTwo);
    var inter = new Intersection(relationOne, relationTwo);
    onlyHasDuplicates(inter,common);
  }

});
