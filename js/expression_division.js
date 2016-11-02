try {
  var Projection = require('./expression_projection.js');
  var Rename = require('./expression_rename.js');
  var Crossproduct = require('./expression_crossproduct.js');
  var Minus = require('./expression_minus.js');
} catch (e) {
  console.error(e);
}

function Division(input1, input2) {
    this.input1 = input1;
    this.input2 = input2;

    this.setChildren([this.input1, this.input2]);


    this.getName = function() {
        return this.input1.getName() + "_" + this.input2.getName();
    };
    this.setName = null;

    this.validate = function() {
      var leftInputColumns = this.input1.getColumns().map(function(x) {
        var data = x.split(".");
        return data[data.length-1];
      });
      var rightInputColumns = this.input2.getColumns().map(function(x) {
        var data = x.split(".");
        return data[data.length-1];
      });
      if (leftInputColumns === null || rightInputColumns === null) {
          throw "Es fehlt mindestens eine Eingaberelation.";
      }
      var commonColumnCount = 0;
      for (var i = 0; i<rightInputColumns.length;i++) {
        if (leftInputColumns.indexOf(rightInputColumns[i]) === -1) {
          throw "Das Schema der rechten Eingaberelation ist keine (echte) Teilmenge des Schemas der linken Eingaberelation.";
        } else {
          commonColumnCount++;
        }
      }
      if (commonColumnCount === leftInputColumns.length) {
        throw "Das Schema der rechten Eingaberelation ist keine (echte) Teilmenge des Schemas der linken Eingaberelation.";
      }
    };

    this.getColumns = function() {
        this.validate();
        var result = [];
        var columns = this.input1.getColumns();
        var dividerColumns = this.input2.getColumns();
        var isInColumns = function(name, columnArray) {
          var data1 = name.split(".");
          return columnArray.reduce(function(r,x) {
            var data2 = x.split(".");
            return r || data1[data1.length-1] === data2[data2.length-1];
          },false);
        };
        for (var i = 0; i<columns.length;i++) {
          if (!isInColumns(columns[i], dividerColumns)) {
            result.push(columns[i]);
          }
        }
        return result;
    };
    this.setColumns = null;

    this.getResult = function() {
        this.validate();
        var cols = this.getColumns();
        var pro = new Projection(cols.toString(), this.input1);
        var cp = new Crossproduct(pro, this.input2);
        var namingCommand = "";
        var cpColumns = cp.getColumns();
        for (var i=0;i<cpColumns.length;i++) {
          var data = cpColumns[i].split(".");
          namingCommand += data[data.length-1] + "<-" + cpColumns[i] + ",";
        }
        var newNames = new Rename(namingCommand,cp);
        var min = new Minus(newNames, this.input1);
        var proj = new Projection(cols.map(function(x) {
          var data = x.split(".");
          return data[data.length-1];
        }).toString(), min);
        min = new Minus(pro, proj);
        return min.getResult();
    };

    this.copy = function() {
        return new Division(this.input1.copy(), this.input2.copy());
    };

    this.toHTML = function(options) {
        var display = '';
        display += '(' + this.input1.toHTML(options) + " " + latex("\\div") +  " " + this.input2.toHTML(options) + ")";
        return display;
    };

    this.toLatex = function(options) {
        return "(" + this.input1.toLatex(options) + "\\div " + this.input2.toLatex(options) + ")";
    };
}

try {
  var Relation = require('../js/relation.js');
  Division.prototype = new Relation();
  module.exports = Division;
} catch(e) {
  Division.prototype = new Relation();
}
