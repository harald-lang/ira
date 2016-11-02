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
function Value() {
    this.kind = Value;

    this.copy = function() {
        return new Value();
    };

    this.toJS = function() {
        return null;
        //throw "Der Ausdruck ist nicht vollständig definiert, es fehlt ein Wert.";
    };

    this.toHTML = function(options) {
        var display = '<a id="block_' + this.blockId + '" class="block" href="javascript:;" ' +
        'onclick="editExpression(getBlock(' + this.blockId + '));">Wert</a> ';
        return display;
    };

    this.toLatex = function(options) {
        return "?";
    };
}

try {
  var Block = require('./block.js');
  Value.prototype = new Block();
  module.exports = Value;
} catch(e) {
  Value.prototype = new Block();
}
