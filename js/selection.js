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
function Selection(condition, input) {
    this.setChildren([condition, input]);

    this.condition = condition;
    this.input = input;

    this.getName = function() {
        return this.input.getName();
    }
    this.setName = null;

    this.getColumns = function() {
        return this.input.getColumns();
    }
    this.setColumns = null;

    this.getResult = function() {
        var rel = this.input.getResult();
        var cols = this.input.getColumns();
        var cond = this.condition.toJS();
        if (cond == null) cond = true;
        var result = [];
        var relname = this.input.getName();

        rel.each(function(row) {
            var currentRow = new Object();
            cols.each(function(name, nr) {
                eval("currentRow." + name.gsub(".", "___") + " = " + JSON.stringify(row[nr],0,4) + ";");
                //eval("currentRow." + (relname + "." + name).gsub(".", "___") + " = " + row[nr].toJSON() + ";");
            });
            if (eval(cond)) {
                result.push(row);
            }
        });

        return result;
    }

    this.copy = function() {
        return new Selection(this.condition.copy(), this.input.copy());
    }

    this.toHTML = function(options) {
        var display = '(' + latex("\\sigma");
        display += '<span style=\'font-size:10pt; vertical-align: bottom\'>' + this.condition.toHTML(options) + "</span> " + this.input.toHTML(options) + ")";
        return display;
    }

    this.toLatex = function(options) {
        return "\\sigma_{" + this.condition.toLatex(options) + "}" + this.input.toLatex(options) + "";
    }
}
Selection.prototype = new Relation();
