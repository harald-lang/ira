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
function ValueColumn(col) {
    this.kind = ValueColumn;
    this.column = col;

    this.copy = function() {
        return new ValueColumn(col);
    };

    this.toJS = function() {
        return "currentRow." + this.column.gsub(".", "___");
    };

    this.toHTML = function(options) {
        return this.column;
    };

    this.toLatex = function(options) {
        return '\\textrm{' + this.column.gsub("_", "\\_") + '}';
    };
}

try {
  var Value = require('./value.js');
  ValueColumn.prototype = new Value();
  module.exports = ValueColumn;
} catch (e) {
  ValueColumn.prototype = new Value();
}
