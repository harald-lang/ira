function TestPrototype() {

  Array.prototype.each = function (f) {
    this.forEach(f);
  };

  Array.prototype.toJSON = function() {
    return "" + this;
  };

  String.prototype.strip = function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  };

  String.prototype.gsub = function (pattern, replacement) {
    return this.replace(pattern,replacement);
  };

  String.prototype.toJSON = function () {
    return this;
  };
}

module.exports = TestPrototype;
