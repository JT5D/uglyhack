var BaseNode = Class.extend({
	init: function(index){
    	this.idx = index;
    	this.myConnections = new Array();
  	},
  	createMainEl: function(createDrag, createDrop) {
  		var thisNode = this;
  		var el = this.el = $('<div>');
		el.addClass('node');
		el.addClass('hero-unit');
		el.html(this.name);
		el.draggable({
			stack: 'div.node',
			drag: function() {
				thisNode.updateConnectionLines();
			},
		});
		
		if(createDrag) {
			var arrRight = $('<div>');
			var tempConnectionLine = null;
			arrRight.draggable({
				revert: true,
				snap: '.nodedrop',
				start: function() {
					tempConnectionLine = thisNode.createConnectionLine(thisNode.el, arrRight, null, null, true)
				},
				drag: function() {
					var linePosData = thisNode.getLinePosData(thisNode.el, arrRight, true);
					thisNode.updateConnectionLine(tempConnectionLine, linePosData);
				},
				stop: function() {
					tempConnectionLine.remove();
				}
			});
			arrRight.addClass('nodedrag');
			arrRight.attr('data-nodeIndex', this.idx);
			el.append(arrRight);
			
			var arrRightIn = $('<div>');
			arrRightIn.addClass('nodedrag-in');
			arrRight.append(arrRightIn);
		}

		if(createDrop) {
			
			var dropEl = $('<div>');
			dropEl.addClass('nodedrop');
			dropEl.droppable({
				accept: ".nodedrag",
				drop: function( event, ui ) {
					var dEl = $(ui.draggable[0]);
					var dragFromIndex = dEl.attr('data-nodeIndex');
					var fromN = nodes[dragFromIndex];
					var toN = nodes[thisNode.idx];

					$('.templine').remove();
					if(nodes[dragFromIndex].connectTo(thisNode)) {
						thisNode.createConnectionLine(fromN.el,toN.el,fromN.idx,toN.idx, false);
						thisNode.updateConnectionLines();
					}
				}
			});
			el.append(dropEl);
		}

		
		$('body').append(el);
		return el;
  	},
  	connectTo: function(node) {
  		if(this.myConnections.indexOf(node) != -1) {
  			return false;
  		}

		var conns = node.getConnections();
		for(var i in conns) {
			this.thingy.connect(conns[i]);
		}
		this.myConnections.push(node);
		return true;
	},
  	disconnectFrom: function(node) {
		var conns = node.getConnections();
		for(var i in conns) {
			this.thingy.disconnect(conns[i]);
		}
		var idx = this.myConnections.indexOf(node);
		if(idx!=-1) this.myConnections.splice(idx, 1);
  	},
  	getConnections: function() {
		var arr = new Array();
		arr[0] = this.thingy;
		return arr;
	},
  	toString: function() {
		var s = this.name + " to ";
		for(var i in this.myConnections) {
			if(i > 0) {
				s += ", ";
			}
			s += this.myConnections[i].name;
		}
		return s;
	},
	createConnectionLine: function(fromEl, toEl, fromIdx, toIdx, temp) {
		var linePosData = this.getLinePosData(fromEl, toEl, temp);

	    var line = $('<div>')
	        .appendTo('body')
	        .addClass('line')
	        .attr({
	        	'data-fromIdx': fromIdx,
	        	'data-toIdx': toIdx
	        })
	        .css({
	          'position': 'absolute',
	          'webkit-transform': linePosData.transform,
	          '-moz-transform': linePosData.transform,
	          'transform': linePosData.transform
	        })
	        .width(linePosData.length)
	        .offset({left: linePosData.left, top: linePosData.top});
	    if(temp) {
	    	line.addClass('templine');
	    } else {
	    	line.on('click', function() {
	    		var fromN = nodes[line.attr('data-fromIdx')];
				var toN = nodes[line.attr('data-toIdx')];
				fromN.disconnectFrom(toN);
				$(this).remove();
	    	})
	    }

	    return line;
	},
	updateConnectionLines: function() {
		var thisNode = this;
		$('.line').each(function() {
			var line = $(this);
			var fromEl = nodes[line.attr('data-fromIdx')].el;
			var toEl = nodes[line.attr('data-toIdx')].el;
			var linePosData = thisNode.getLinePosData(fromEl, toEl, false);

			thisNode.updateConnectionLine(line, linePosData);
		});
	},
	updateConnectionLine: function(line, linePosData) {
		line.css({
          'webkit-transform': linePosData.transform,
          '-moz-transform': linePosData.transform,
          'transform': linePosData.transform
        })
        .width(linePosData.length)
        .offset({left: linePosData.left, top: linePosData.top});
	},
	getLinePosData: function(fromEl, toEl, temp) {
		var fromElPos = fromEl.offset();
		var toElPos = toEl.offset();

		var fromElWidth = fromEl.width();
		var fromElHeight = fromEl.height();
		var toElHeight = toEl.height();

		var x1 = fromElPos.left+fromElWidth;
		var y1 = fromElPos.top+fromElHeight/2;
		var x2 = toElPos.left;
		var y2 = toElPos.top+toElHeight/2;

		if(temp) {
			x2 += 5;
			y2 += 20;
		} else {
			x1 += 10;
			y1 += 5;
			x2 -= 22;
			y2 += 5;			
		}

		var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;	
		return {
			length: Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)),
	  		transform: 'rotate('+angle+'deg)',
	  		top: y1 < y2 ? y1 : y1 - (y1-y2),
	  		left: x1 < x2 ? x1 : x1 - (x1-x2)
		}
	}
});