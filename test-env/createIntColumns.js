function createIntColumns(length) {
  var array = [];
  for (var i = 0; i < length; i++) {
    var r;
    do {
      r = Math.floor(Math.random()*100).toString();
    } while(array.indexOf(r) >= 0);
    array.push(r);
  }
  return array;
}

module.exports = createIntColumns;
