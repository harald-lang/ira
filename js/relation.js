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

function Relation() {
    this.kind = Relation;

    // returns contents of this relation object
    this.getResult = function() {
        return [];
    };

    this.getName = function() {
        return "";
    };
    this.setName = null;

    this.getColumns = function() {
        return [];
    };
    this.setColumns = null;

    this.copy = function() {
        return new Relation();
    };

    this.toJS = function() {
        throw "Der Ausdruck ist nicht vollständig definiert, es fehlt eine Relation.";
    };

    this.toHTML = function(options) {
        return '<a id="block_' + this.blockId + '" class="block" href="javascript:;" onclick="editExpression(getBlock(' + this.blockId + '));">Ausdruck</a>';
    };

    this.toLatex = function(options) {
        return "\\emptyset";
    };
}

try {
  var Block = require('../js/block.js');
  Relation.prototype = new Block();
  module.exports = Relation;
} catch(e) {
  Relation.prototype = new Block();
}
