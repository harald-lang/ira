var ConditionOr = require('../js/condition_or.js');
var ConditionAnd = require('../js/condition_and.js');
var ConditionNot = require('../js/condition_not.js');
var ConditionComparison = require('../js/condition_comparison.js');
var ValueColumn = require('../js/value_column.js');
require('../test-env/TestPrototype.js')();

var truthTables = {
  "or": [false,true,true,true],
  "and": [false,false,false,true]
};

var combinations = ["false,false","false,true","true,false","true,true"];

var conditionForValue = function(value) {
  return {
    toJS: function() {
      return value;
    }
  };
};

var checkTable = function(table, ConditionClass) {
  var test = function(a,b,r) {
    it('prints out the valid js', function() {
      var item = new ConditionClass(a,b);
      var res = eval(item.toJS());
      expect(res).toBe(r);
    });
  };
  for (var i = 0; i < combinations.length; i++) {
    var c = combinations[i].split(",");
    var a = conditionForValue(c[0]);
    var b = conditionForValue(c[1]);
    test(a,b,table[i]);
  }
};

describe('Or', function() {
  checkTable(truthTables.or,ConditionOr);
});

describe('And', function() {
  checkTable(truthTables.and,ConditionAnd);
});

describe('Not', function() {
  it('negates correctly', function() {
    var item = {
      toJS: function() {
        return "true";
      }
    };
    var not = new ConditionNot(item);
    var res = eval(not.toJS());
    expect(res).toBe(false);
    item = {
      toJS: function() {
        return "false";
      }
    };
    not = new ConditionNot(item);
    res = eval(not.toJS());
    expect(res).toBe(true);
  });
});

var operations = ["=","!=","<=",">=","<",">"];
var opFunctions = [function(a,b) {return a === b;}, function(a,b) {return a !== b;}, function(a,b) { return a <= b; }, function(a,b) { return a >= b; }, function(a,b) { return a < b; }, function(a,b) { return a > b; }];

describe('Comparison', function() {
  it('compares correctly', function() {
    for (var i = 0; i < operations.length; i++) {
      var op = operations[i];
      var f = opFunctions[i];
      for (var j = 0; j < 10; j++) {
        var currentRow = {};
        var a = Math.floor(Math.random() * 20 + 1);
        var b = Math.floor(Math.random() * 20 + 1);
        var nameA = "A" + a;
        var nameB = "B" + b;
        currentRow[nameA] = a;
        currentRow[nameB] = b;
        var comp = new ConditionComparison(op,new ValueColumn(nameA),new ValueColumn(nameB));
        var real = f(a,b);
        var res = eval(comp.toJS());
        expect(res).toBe(real);
      }
    }

  });
});
