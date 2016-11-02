var DataRelation = require('../js/data_relation.js');
var Rename = require('../js/expression_rename.js');
var createIntColumns = require('../test-env/createIntColumns.js');
require('../test-env/TestPrototype.js')();

function checkAtSingleRename(a,b,i) {
  it('renames the entire relation correctly', function() {
    expect(a[i]).toBe("NewName." + b[i]);
  });
}

function checkRandomRename(a,b,i) {
  it('renames every column', function() {
    expect(a[i]).toBe(b[i]);
  });
}

describe('Rename', function() {
  var noOfCol = Math.floor(Math.random() * 5 + 1);
  var columns = createIntColumns(noOfCol);
  var relation = new DataRelation(1,columns,[columns]);
  var renamed = new Rename("NewName",relation);
  var renamedColumns = renamed.getColumns();
  var i;
  for (i = 0; i < columns.length; i++) {
    checkAtSingleRename(renamedColumns,columns,i);
  }
  var newCols = createIntColumns(noOfCol);
  var renameString = "";
  for (i = 0; i < newCols.length; i++) {
    renameString += newCols[i] + "<-" + columns[i] + ",";
  }
  renamed = new Rename(renameString,relation);
  renamedColumns = renamed.getColumns();
  for (i = 0; i < columns.length; i++) {
    checkRandomRename(renamedColumns,newCols,i);
  }
});
