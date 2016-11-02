/*
IRA - Interactive Relational Algebra Tool
Copyright (C) 2010-2012 Henrik Mühe

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function Union(input1, input2) {
    this.setChildren([input1, input2]);

    this.input1 = input1;
    this.input2 = input2;

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
            throw "Es fehlt mindestens eine Eingaberelation der Vereinigung.";
        }

        leftInputColumns.each(function(c, nr) {
            if (c != rightInputColumns[nr]) {
                throw "Die Spaltenzahl und Namen der zwei Eingaberelationen müssen für die Vereinigung gleich sein!";
            }
        });
    };

    this.getName = function() {
        this.validate();
        return this.input1.getName() + "_" + this.input2.getName();
    };
    this.setName = null;

    this.getColumns = function() {
        this.validate();
        return this.input1.getColumns();
    };
    this.setColumns = null;

    this.getResult = function() {
        this.validate();
        var rel1 = this.input1.getResult();
        var rel2 = this.input2.getResult();
        var col1 = this.input1.getColumns();
        var result = rel1;

        rel2.each(function(row2) {
            var dont_add = false;
            rel1.each(function(row1) {
                var fields_differ = false;
                row1.each(function(c, nr) {
                    if (c != row2[nr]) {
                        fields_differ = true;
                    }
                });

                if (!fields_differ) {
                    dont_add = true;
                }
            });

            if (!dont_add) {
                result.push(row2);
            }
        });

        return result;
    };

    this.copy = function() {
        return new Union(this.input1.copy(), this.input2.copy());
    };

    this.toHTML = function(options) {
        var display = '';
        display += '(' + this.input1.toHTML(options) + " " + latex("\\cup") + " " + this.input2.toHTML(options) + ")";
        return display;
    };

    this.toLatex = function(options) {
        return "(" + this.input1.toLatex(options) + "\\cup " + this.input2.toLatex(options) + ")";
    };
}

try {
  var Relation = require('../js/relation.js');
  Union.prototype = new Relation();
  module.exports = Union;
} catch(e) {
  Union.prototype = new Relation();
}
