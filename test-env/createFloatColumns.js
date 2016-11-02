var createIntColumns = require('./createIntColumns.js');
var createFloatColumns = function(columns) {
  var c = createIntColumns(columns);
  return c.map(function(x) { return x + ".5";});
};

module.exports = createFloatColumns;
