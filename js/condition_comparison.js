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
function ConditionComparison(op, value1, value2) {
    this.value1 = value1;
    this.value2 = value2;
    this.op = op;

    this.setChildren([this.value1, this.value2]);

    this.copy = function() {
        return new ConditionComparison(op, this.value1.copy(), this.value2.copy());
    };

    this.toJS = function() {
        if (this.value1.toJS() === null || this.value2.toJS() === null) return null;
        if (this.op == "=") {
            this.op = "==";
        }
        return this.value1.toJS() + " " + this.op + " " + this.value2.toJS();
    };

    this.opToLatex = function(o) {
        switch (o) {
        case '==':
            return '=';
        case '!=':
            return '\\neq';
        case '<=':
            return '\\leq';
        case '>=':
            return '\\geq';
        default:
            return this.op;
        }
    };

    this.toHTML = function(options) {
        var display = '';
        display += this.value1.toHTML(options) + latex(this.opToLatex(this.op)) + this.value2.toHTML(options) + '';
        return display;
    };

    this.toLatex = function(options) {
        return this.value1.toLatex(options) + this.opToLatex(this.op) + ' ' + this.value2.toLatex(options);
    };
}
try {
  var Condition = require('./condition.js');
  ConditionComparison.prototype = new Condition();
  module.exports = ConditionComparison;
} catch (e) {
  ConditionComparison.prototype = new Condition();
}
