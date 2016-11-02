var createColumns = require('./createColumns.js');

var createData = function(rows,columns) {
  var data = [];
  for (var i = 0; i < rows; i++) {
    data.push(createColumns(columns));
  }
  return data;
};

module.exports = createData;
