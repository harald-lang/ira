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

function Join(input1, input2) {
    this.leftOuter = false;
    this.rightOuter = false;

    this.input1 = input1;
    this.input2 = input2;

    this.setChildren([this.input1, this.input2]);

    this.getInput1 = function() {
        return this.input1;
    };

    this.getInput2 = function() {
        return this.input2;
    };

    this.getName = function() {
        return this.input1.getName() + "_" + this.input2.getName();
    };
    this.setName = null;

    this.moo = function() {
        alert('moo');
    };

    this.getColumns = function() {
        var columns = this.input1.getColumns().slice(0);
        var isInJoin = function(c) {
          var data2 = c.split(".");
          return columns.reduce(function(r,n) {
            var data1 = n.split(".");
            return r || data1[data1.length-1] == data2[data2.length-1];
          }, false);
        };
        return columns.concat(this.input2.getColumns().filter(function(c) {
          return !isInJoin(c);
        }));
    };
    this.setColumns = null;

    this.getResult = function() {
        var rel1 = this.input1.getResult();
        var rel2 = this.input2.getResult();
        var col1 = this.input1.getColumns();
        var col2 = this.input2.getColumns();
        var result = [];

        // find natural join columns
        var joincolumns = [];

        col1.each(function(c1) {
            var data1 = c1.split(".");
            col2.each(function(c2) {
                var data2 = c2.split(".");
                if (data1[data1.length-1] == data2[data2.length-1]) {
                    joincolumns.push([c1,c2]);
                }
            });
        });

        var isInJoin = function(c) {
          return joincolumns.reduce(function(r,n) {
            return r || n[0] == c || n[1] == c;
          }, false);
        };

        // build result
        var rights_added = {};
        var left_outer = this.leftOuter;
        rel1.each(function(row1) {
            var left_added = false;
            rel2.each(function(row2, nr) {
                var good = true;
                joincolumns.each(function(c) {
                    if (row1[col1.indexOf(c[0])] != row2[col2.indexOf(c[1])]) {
                        good = false;
                    }
                });

                if (good) {
                    var newrow = row1.slice(0);
                    col2.each(function(c, nr) {
                        if (!isInJoin(c)) {
                            newrow.push(row2[nr]);
                        }
                    });
                    result.push(newrow);

                    rights_added[nr] = true;
                    left_added = true;
                }
            });

            // left outer join addon
            if (left_outer && !left_added) {
                var newrow = row1.slice(0);
                for (i = 0; i < col2.length - joincolumns.length; i++) {
                    newrow.push(null);
                }
                result.push(newrow);
            }
        });

        // right outer join addon
		var columns = this.getColumns();
        if (this.rightOuter) {
            rel2.each(function(row2, nr) {
                if (!rights_added[nr]) {
                    var newrow = [];
					// add left-hand columns
					for (i = 0; i < col1.length; i++) {
						if (joincolumns.indexOf(col1[i]) < 0) {
                            newrow.push(null);
                        } else {
							newrow.push(row2[col2.indexOf(col1[i])]);
						}
                    }
					// add right-hand columns
					for (i = 0; i < col2.length; i++) {
						console.log(col2[i] + " " + joincolumns.indexOf(col2[i]));
						if (joincolumns.indexOf(col2[i]) < 0) {
							newrow.push(row2[i]);
                        } else {
							// already added
						}
                    }
                    /*for (i = 0; i < col1.length - joincolumns.length; i++) {
                        newrow.unshift(null);
                    }*/
                    result.push(newrow);
                }
            });
        }

        return result;
    };

    this.copy = function() {
        return new Join(this.input1.copy(), this.input2.copy());
    };

    this.toHTML = function(options) {
        var display = '';
        display += '(' + this.input1.toHTML(options) + " " + latex("\\bowtie") + " " + this.input2.toHTML(options) + ")";
        return display;
    };

    this.toLatex = function(options) {
        return "(" + this.input1.toLatex(options) + "\\bowtie " + this.input2.toLatex(options) + ")";
    };
}

try {
  var Relation = require('../js/relation.js');
  Join.prototype = new Relation();
  module.exports = Join;
} catch(e) {
  Join.prototype = new Relation();
}
