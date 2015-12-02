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
debug = false;
saves = new Hash();
expressionHistory = [];
inlineUserDefinedRelations = false;

/*
  These two functions getSaves and saveSaves do all the casting play requiered
  for us to parse what we stored in localStorage.
  It's pretty much a hack on top of a hack.
*/

function getSaves() {
  try {
    var storaged = window.localStorage.getItem("tables");
    /*
      Double parse, because localStorage reads the array as a string and the objects
      again as a string and for some reason parsing once is not enough...
    */
    var savesAsArray = JSON.parse(JSON.parse(storaged));
    if (Array.isArray(savesAsArray)) {
      for (var i=0;i<savesAsArray.length;i++) {
        /*
          Without this parsing and recreating of the object it
          will think it's an empty relation and return nothing.
        */
        var itemWithOutCast = savesAsArray[i][1];
        var item = new DataRelation(
    			itemWithOutCast.name,
    			itemWithOutCast.columns,
    			itemWithOutCast.data,
    			itemWithOutCast.expression
    		);
        saves.set(savesAsArray[i][0],item);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function saveSaves() {
  var savesAsArray = [];
  saves.each(function(kvp) {
      var key = kvp.key;
      var table = kvp[1];
      var tuple = [key, table];
      savesAsArray.push(tuple);
  });
  window.localStorage.setItem("tables", JSON.stringify(savesAsArray));
}

function removeFromSaves(name) {
  saves.unset(name);
  saveSaves();
  reset();
}

function reset() {
    blockid = 0;
    expression = addBlock(new Relation());
    currentBlock = expression;
    updateDisplay();
}

function save(name) {
	if(name === null)
		return;
	name = name.trim();
	if(name.length === 0)
		return;
    saves.set(name,
		new DataRelation(
			name,
			expression.getColumns(),
			expression.getResult(),
			expression
		)
    );
    saveSaves();
    reset();
}

function editExpression(block) {
    currentBlock = block;
    updateDisplay(false);
}

function leftSide() {
    return $('side').checked;
}

function wrapAroundCheck() {
    if (currentBlock === null) {
        var oldExp = expression;
        expression = addBlock(new Relation());
        currentBlock = expression;
        return oldExp;
    } else {
        if (currentBlock.kind == Relation) {
            return new Relation();
        } else {
            // error, can't wrap, remove save
            expressionHistory.pop();
            return null;
        }
    }
}

function handleColumn(column) {
    if (currentBlock && currentBlock.kind == Value) {
        addValueColumn(column);
    } else if (currentBlock === null) {
        if (expression.kind == Projection) {
            var cols = expression.getColumnsParam().split(",");
            cols = cols.without(column);
            expression.setColumnsParam(cols.join(","));
            updateDisplay();
        } else {
            addProjection(expression.getColumns().without(column).join(","));
        }
    }
}

function saveHistory() {
    // save
    expressionHistory.push(expression.copy());
}

function back() {
    if (expressionHistory.length === 0) return;
    expression = expressionHistory.pop();
    expression.resetBlockIds();
    currentBlock = null;
    updateDisplay(true);
}

function addSelection() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new Selection(
    addBlock(new Condition(), true),
    addBlock(rel))));
    updateDisplay(true);
}

function addProjection(cols) {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new Projection(
    cols,
    addBlock(rel, true))));
    updateDisplay(true);
}

function addCrossproduct() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new Crossproduct(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true)
    )));
    updateDisplay(true);
}

function addJoin() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new Join(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addLeftSemiJoin() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new LeftSemiJoin(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addRightSemiJoin() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new RightSemiJoin(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addLeftAntiJoin() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new LeftAntiJoin(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addRightAntiJoin() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new RightAntiJoin(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addOuterJoin() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new OuterJoin(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addLeftOuterJoin() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new LeftOuterJoin(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addRightOuterJoin() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new RightOuterJoin(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addMinus() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new Minus(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addDivision() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new Division(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addIntersection() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new Intersection(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addUnion() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new Union(
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addConditionalJoin() {
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new ConditionalJoin(
    addBlock(new Condition(), true),
    leftSide() ? addBlock(rel, true) : addBlock(new Relation()),
    leftSide() ? addBlock(new Relation()) : addBlock(rel, true))));
    updateDisplay(true);
}

function addRename(renames) {
    if (!renames) return;
    saveHistory();
    var rel = wrapAroundCheck();
    if (rel === null) return;
    // not a Relation if this happens
    Object.extend(currentBlock,
    addBlock(new Rename(
    renames,
    addBlock(rel, true))));
    updateDisplay(true);
}

function addDataRelation(rel) {
    if (!currentBlock || currentBlock.kind != Relation) return;
    saveHistory();
    Object.extend(currentBlock,
    addBlock(rel));
    updateDisplay(true);
}

function addValueLiteral(lit) {
    if (!currentBlock || currentBlock.kind != Value || !lit) return;
    saveHistory();
    Object.extend(currentBlock,
    addBlock(new ValueLiteral(lit)));
    updateDisplay(true);
}

function addValueColumn(name) {
    if (!currentBlock || currentBlock.kind != Value || !name) return;
    saveHistory();

    Object.extend(currentBlock,
    addBlock(new ValueColumn(name)));

    updateDisplay(true);
}

function addConditionAnd() {
    if (!currentBlock || currentBlock.kind != Condition) return;
    saveHistory();
    Object.extend(currentBlock,
    addBlock(new ConditionAnd(
    addBlock(new Condition(), true),
    addBlock(new Condition()))));
    updateDisplay(true);
}

function addConditionOr() {
    if (!currentBlock || currentBlock.kind != Condition) return;
    saveHistory();
    Object.extend(currentBlock,
    addBlock(new ConditionOr(
    addBlock(new Condition(), true),
    addBlock(new Condition()))));
    updateDisplay(true);
}

function addConditionNot() {
    if (!currentBlock || currentBlock.kind != Condition) return;
    saveHistory();
    Object.extend(currentBlock,
    addBlock(new ConditionNot(
    addBlock(new Condition(), true))));
    updateDisplay(true);
}

function addConditionComparison(op) {
    if (!currentBlock || currentBlock.kind != Condition) return;
    saveHistory();
    Object.extend(currentBlock,
    addBlock(new ConditionComparison(
    op,
    addBlock(new Value(), true),
    addBlock(new Value()))));
    updateDisplay(true);
}

function updateDisplay(reset) {
    // update saves list
    var list = $("savelist");
    list.innerHTML = "";

    saves.each(function(kvp) {
        var key = kvp.key;
        var a = document.createElement('li');
        list.appendChild(a);
        a.innerHTML = '<a href="javascript:;" onclick="addDataRelation(saves.get(\'' + key + '\'))">' +
        '$\\large{' + key + '}$ Relation einsetzen  </a>' +
        '<br><a href="javascript:;" onclick="removeFromSaves(\'' + key + '\')">' +
        'Relation löschen</a>';
    });

    // update expression display
    var display = $("display_expression");
    display.innerHTML = "";
    var a = document.createElement('div');
    display.appendChild(a);
    var displayOptions = {
      inline: inlineUserDefinedRelations
    };
    a.innerHTML = expression.toHTML(displayOptions);

    if (reset)
    resetCurrentBlock();

    // HUGE hack
    if (currentBlock && currentBlock.kind == Value) {
        $$(".toolbox").each(function(c) {
            c.style.opacity = 0.3;
        });
        $$(".toolbox_values").each(function(c) {
            c.style.opacity = 1;
        });
        jQuery("#tabs").tabs('select', 2);
    } else if (currentBlock && currentBlock.kind == Condition) {
        $$(".toolbox").each(function(c) {
            c.style.opacity = 0.3;
        });
        $$(".toolbox_conditions").each(function(c) {
            c.style.opacity = 1;
        });
        jQuery("#tabs").tabs('select', 1);
    } else {
        // if (currentBlock instanceof Relation) {
        $$(".toolbox").each(function(c) {
            c.style.opacity = 0.3;
        });
        $$(".toolbox_expressions").each(function(c) {
            c.style.opacity = 1;
        });
        jQuery("#tabs").tabs('select', 0);
    }

    if (currentBlock === null) {
        $('side_selector').style.opacity = 1;
    } else {
        $('side_selector').style.opacity = 0.3;
    }

    // latex display
    $("display_expression_latex").innerHTML = latex(expression.toLatex(displayOptions));

    highlightBlock(currentBlock);

    updateResult();

	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

function updateResult() {

    var result;
    if (debug) {
        result = expression.getResult();
    } else {
        try {
            result = expression.getResult();
            $("error").innerHTML = "";
        } catch(e) {
            $("error").innerHTML = "Problem: " + e + "<br />";
            return;
        }
    }
    var h = '';

    h += '<h4>Relation: ' + expression.getName() + '</h4>';
    h += '<table class="ui-widget">';
    h += '<thead class="ui-widget-header"><tr>';

    // header
    expression.getColumns().each(function(c) {
        h += '<th><a href="javascript:;" onclick="handleColumn(\'' + c + '\')">' + c + '</a></th>';
    });

    h += '</tr></thead><tbody class="ui-widget-content">';

    result.each(function(row) {
        h += '<tr>';
        row.each(function(v) {
            h += '<td><a href="javascript:;" onclick="addValueLiteral(\'' + v + '\')">' + v + '</a></td>';
        });
        h += '</tr>';
    });

    h += '</tbody></table>';

    var display = $("result");
    display.innerHTML = "";
    var a = document.createElement('div');
    display.appendChild(a);
    a.innerHTML = h;

    //$("result").innerHTML = h;
}

function highlightBlock(block) {
    if (!block)
    return;

    $$(".block").each(function(e) {
        e.style.color = "black";
    });
    $("block_" + block.blockId).style.color = "red";
}

function addBlock(o) {
    return addBlock(o, false);
}

function addBlock(o, activate) {
    o.blockId = ++blockid;

    if (activate) {
        currentBlock = o;
    }

    return o;
}

function getBlock(id) {
    return expression.findChild(id);
}

function resetCurrentBlock() {
    if ($$(".block")[0]) {
        currentBlock = getBlock(parseInt($$(".block")[0].id.substring(6)));
    } else {
        currentBlock = null;
    }
}

function latex(str) {
    var s = str;
    s = s.gsub("ä", 'ae');
    //'\\"{a}');
    s = s.gsub("ö", 'oe');
    //''\\"{o}');
    var dpi = 150;

    if (str.length > 100) dpi = 120;

    //return ' <img border="0" src="http://www.mathtran.org/cgi-bin/toy/?tex='+str+'" alt="'+str+'"/> ';
    //return ' <img border="0" src="http://dbkemper4-vm10.informatik.tu-muenchen.de/~muehe/cgi-bin/mathtex.cgi?' + encodeURIComponent('\\gammacorrection{.9}\\png\\dpi{' + dpi + '}' + s) + '" alt="' + escape(s) + '"/> ';
	return "<span>$" + str + "$</span>";
}

function toggleInlineUserDefinedRelations(){
	inlineUserDefinedRelations = !inlineUserDefinedRelations;
	updateDisplay(reset);
}

getSaves();
