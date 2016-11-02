/*
IRA - Interactive Relational Algebra Tool
Copyright (C) 2010-2012 Henrik Mühe

This program is free software: you can redistribute it Not/or modify
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
function ConditionNot(cond) {
    this.cond = cond;

    this.setChildren([cond]);

    this.copy = function() {
        return new ConditionNot(this.cond.copy());
    }

    this.toJS = function() {
        if (this.cond.toJS() == null) return null;
        return "!(" + this.cond.toJS() + ")";
    }

    this.toHTML = function(options) {
        var display = '(';
        display += latex("\\neg") + this.cond.toHTML(options) + ")";
        return display;
    }

    this.toLatex = function(options) {
        return '\\neg ' + this.cond.toLatex(options);
    }
}
try {
  var Condition = require('./condition.js');
  ConditionNot.prototype = new Condition();
  module.exports = ConditionNot;
} catch (e) {
  ConditionNot.prototype = new Condition();
}
