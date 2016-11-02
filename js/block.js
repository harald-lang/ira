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
function Block() {
    this.kind = Block;

    this.children = [];
    this.getChildren = function() {
        return this.children;
    };

    this.setChildren = function(c) {
        this.children = c;
    };

    this.copy = function() {
        throw "Kann abstrakte Klasse Block nicht kopieren.";
    };

    this.resetBlockIds = function() {
        if (!this.blockId) {
            this.blockId = ++blockid;
            this.getChildren().each(function(c) {
                c.resetBlockIds();
            });
        }
    };

    this.findChild = function(id) {
        if (this.blockId == id) {
            return this;
        } else {
            var result = null;
            this.getChildren().each(function(c) {
                var f = c.findChild(id);
                if (f !== null) {
                    result = f;
                }
            });
            return result;
        }
    };
}

try {
  module.exports = Block;
} catch(e) { }
