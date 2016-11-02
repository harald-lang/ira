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
function Projection(columns, input) {
    this.columns = columns;
    this.input = input;

    this.setChildren([this.input]);

    this.kind = Projection;

    this.getColumnsParam = function() {
        return this.columns;
    };

    this.setColumnsParam = function(col) {
        this.columns = col;
    };

    this.getName = function() {
        return this.input.getName();
    };

    this.getColumns = function() {
        return this.columns.split(",");
    };
    this.setColumns = null;

    this.getResult = function() {
        var rel = this.input.getResult();
        var cols = this.input.getColumns();
        var pcols = this.columns.split(",");
        var result = [];

        // fix columns
        var fixedcols = [];
        pcols.each(function(c) {
            fixedcols.push(c.strip());

            if (cols.indexOf(c) < 0) {
                throw "Eine oder mehrere Spalten die projeziert werden sollen existieren nicht, insbesondere \"" + c + "\"";
            }
        });
        pcols = fixedcols;

        var dupeMap = {};
        // assemble result
        rel.each(function(row) {
            var newrow = [];
            pcols.each(function(pcol) {
                newrow.push(row[cols.indexOf(pcol)]);
            });

            // do not add anything twice!
            if (!dupeMap[newrow.toJSON()]) {
                result.push(newrow);
                dupeMap[newrow.toJSON()] = true;
            }
        });

        return result;
    };

    this.copy = function() {
        return new Projection(this.columns, this.input.copy());
    };

    this.toHTML = function(options) {
        var display = '(';
        display += latex("\\Pi");
        display += '<span style=\'font-size:10pt; vertical-align: bottom\'>' + this.columns + "</span> " + this.input.toHTML(options) + ")";
        return display;
    };

    this.toLatex = function(options) {
        return "(\\Pi_{" + this.columns + "}" + this.input.toLatex(options) + ")";
    };
}
try {
  var Relation = require('../js/relation.js');
  Projection.prototype = new Relation();
  module.exports = Projection;
} catch(e) {
  Projection.prototype = new Relation();
}
