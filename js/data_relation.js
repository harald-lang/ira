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
function DataRelation(name, columns, data, expr) {
    this.name = name;
    this.columns = columns;
    this.data = data;
    this.expression = expr;

    this.copy = function() {
        return new DataRelation(name, columns, data);
    }

    this.getName = function() {
        return this.name;
    }
    this.setName = null;

    this.getColumns = function() {
        return this.columns;
    }
    this.setColumns = null;

    this.getResult = function() {
        return this.data;
    }

    this.toHTML = function() {
        return latex(this.toLatex());
    }

    this.toLatex = function() {
        return showFull && this.expression != undefined ? this.expression.toLatex() : this.name;
    }
}
DataRelation.prototype = new Relation;