var Relation = require('../js/relation.js');

describe('Relation', function() {
  var rel = new Relation();
  it('is an empty Relation', function() {
    var res = rel.getResult();
    var col = rel.getColumns();
    var name = rel.getName();
    expect(res.length).toBe(0);
    expect(col.length).toBe(0);
    expect(name).toBe("");
    expect(rel.kind).toBe(Relation);
  });
});
