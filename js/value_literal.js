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
function ValueLiteral(lit) {
    this.literal = lit;

    this.copy = function() {
        return new ValueLiteral(lit);
    };

    this.toJS = function() {
        return "\"" + this.literal + "\"";
    };

    this.toHTML = function(options) {
        return "'" + this.literal + "'";
    };

    this.toLatex = function(options) {
        return "'\\textrm{" + this.literal + "}'";
    };
}

try {
  var Value = require('./value.js');
  ValueLiteral.prototype = new Value();
  module.exports = ValueLiteral;
} catch (e) {
  ValueLiteral.prototype = new Value();
}
