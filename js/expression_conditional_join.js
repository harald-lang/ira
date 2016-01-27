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
function ConditionalJoin(condition, input1, input2) {
    this.input1 = input1;
    this.input2 = input2;
    this.condition = condition;

    this.setChildren([this.condition, this.input1, this.input2]);


    this.getName = function() {
        return this.input1.getName() + "_" + this.input2.getName();
    };
    this.setName = null;

    this.getColumns = function(renameFirst) {
        var keepsNames = renameFirst ? this.input2.getColumns().clone() : this.input1.getColumns().clone();
        var namesCanChange = renameFirst ? this.input1.getColumns().clone() : this.input2.getColumns().clone();
        var nameOfRenamedRelation = renameFirst ? this.input1.getName() : this.input2.getName();
        namesCanChange = namesCanChange.map(function(c) {
          if (keepsNames.indexOf(c) < 0) {
            return c;
          } else {
            return nameOfRenamedRelation + "." + c;
          }
        });
        return renameFirst ? namesCanChange.concat(keepsNames) : keepsNames.concat(namesCanChange);
    };
    this.setColumns = null;

    this.getResult = function() {
        var cols = this.getColumns();
        var cond = this.condition.toJS();
        if (cond == null) cond = true;
        var result = [];

        var cp = new Crossproduct(this.input1, this.input2)
        var cross = cp.getResult();

        cross.each(function(row) {
            var currentRow = new Object();
            cols.each(function(name, nr) {
                eval("currentRow." + name.gsub(".", "___") + " = " + JSON.stringify(row[nr],0,4) + ";");
                eval("currentRow." + cp.getColumns()[nr].gsub(".", "___") + " = " + JSON.stringify(row[nr],0,4) + ";");
            });
            if (eval(cond)) {
                result.push(row);
            }
        });

        return result;
    }

    this.copy = function() {
        return new ConditionalJoin(this.condition.copy(), this.input1.copy(), this.input2.copy());
    }

    this.toHTML = function(options) {
        var display = '';
        display += '(' + this.input1.toHTML(options) + " " + latex("\\bowtie") + "<span style='font-size:10pt; vertical-align: bottom'>" + this.condition.toHTML(options) + "</span> " + " " + this.input2.toHTML(options) + ")";
        return display;
    }

    this.toLatex = function(options) {
        return "(" + this.input1.toLatex(options) + "\\bowtie_{" + this.condition.toLatex(options) + "} " + this.input2.toLatex(options) + ")";
    }
}
ConditionalJoin.prototype = new Relation;
