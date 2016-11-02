function createColumns(length) {
  var array = [];
  for (var i = 0; i < length; i++) {
    var r;
    do {
      r = Math.random()*100 + "";
    } while(array.indexOf(r) >= 0);
    array.push(r);
  }
  return array;
}

module.exports = createColumns;
