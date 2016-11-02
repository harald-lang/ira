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

function Rename(renames, input) {
    this.setChildren([input]);

    this.renames = renames;
    this.input = input;

    this.getName = function() {
        if (!renames.match("<-")) {
            // rename relation
            return renames;
        } else {
            // return old name
            return this.input.getName();
        }
    };
    this.setName = null;

    this.getColumns = function() {
        var cols = this.input.getColumns();
        var pcols = this.renames.split(",");
        if (renames.indexOf("<-")>=0) {
            var r = {};

            // figure out renames
            pcols.each(function(c) {
                var parts = c.split("<-");
                r[parts[1]] = parts[0];
            });

            // rename columns
            var newcols = [];
            cols.each(function(c) {
                if (r[c]) {
                    newcols.push(r[c]);
                } else {
                    newcols.push(c);
                }
            });
            return newcols;
        } else {
            return this.input.getColumns().map(function (x) {
              return renames + "." + x;
            });
        }
    };
    this.setColumns = null;

    this.getResult = function() {
        return input.getResult();

    };

    this.copy = function() {
        return new Rename(renames, this.input.copy());
    };

    this.toHTML = function(options) {
        var display = '(';
        display += latex("\\rho");
        display += '<span style=\'font-size:10pt; vertical-align: bottom\'>' + renames + "</span> " + this.input.toHTML(options) + ")";
        return display;
    };


    this.toLatex = function(options) {
        var lcol = renames.gsub("<-", '\\leftarrow ');
        return "\\rho_{" + lcol + "}" + input.toLatex(options);
    };
}

try {
  var Relation = require('../js/relation.js');
  Rename.prototype = new Relation();
  module.exports = Rename;
} catch(e) {
  Rename.prototype = new Relation();
}
