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
function Condition() {
    this.kind = Condition;
    this.setChildren([]);

    this.copy = function() {
        return new Condition();
    };

    this.toJS = function() {
        return true;
    };

    this.toHTML = function() {
        var display = '<a id="block_' + this.blockId + '" class="block" href="javascript:;" ' +
        'onclick="editExpression(getBlock(' + this.blockId + '));">Bedingung</a> ';
        return display;
    };

    this.toLatex = function() {
        return "true";
    };

    /**
     * Huge hack!
     * I will change it as soon as I get a better idea.
     * @return {boolean} Does the condition have a value.
     */
    this.isEmpty = function() {
      return this.children.length === 0 || this.toLatex().indexOf("?") >= 0;
    };

}
try {
  var Block = require('../js/block.js');
  Condition.prototype = new Block();
  module.exports = Condition;
} catch(e) {
  Condition.prototype = new Block();
}
