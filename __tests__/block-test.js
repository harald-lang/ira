var Block = require('../js/block.js');

describe('Block', function() {
  var block = new Block();
  it('is an Empty Block', function() {
    var array = block.getChildren();
    expect(array.length).toBe(0);
    expect(block.kind).toBe(Block);
  });
});
