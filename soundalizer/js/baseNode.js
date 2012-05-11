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
			arrRight.draggable({
				revert: true,
				snap: '.nodedrop'
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

					if(nodes[dragFromIndex].connectTo(thisNode)) {
						thisNode.createConnectionLine(dragFromIndex,thisNode.idx);
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
	createConnectionLine: function(fromIdx, toIdx){
	    var fromEl = nodes[fromIdx].el;
		var toEl = nodes[toIdx].el;
		var linePosData = this.getLinePosData(fromEl, toEl);

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

	    return line;
	},
	updateConnectionLines: function() {
		var thisNode = this;
		$('.line').each(function() {
			var line = $(this);
			var fromEl = nodes[line.attr('data-fromIdx')].el;
			var toEl = nodes[line.attr('data-toIdx')].el;
			var linePosData = thisNode.getLinePosData(fromEl, toEl);

			line.css({
	          'webkit-transform': linePosData.transform,
	          '-moz-transform': linePosData.transform,
	          'transform': linePosData.transform
	        })
	        .width(linePosData.length)
	        .offset({left: linePosData.left, top: linePosData.top});
		});
	},
	getLinePosData: function(fromEl, toEl) {
		var fromElPos = fromEl.offset();
		var toElPos = toEl.offset();

		var fromElWidth = fromEl.width();
		var fromElHeight = fromEl.height();
		var toElHeight = toEl.height();

		var x1 = fromElPos.left+fromElWidth+30;
		var y1 = fromElPos.top+fromElHeight/2+5;
		var x2 = toElPos.left-22;
		var y2 = toElPos.top+toElHeight/2+5;

		var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;	
		return {
			length: Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)),
	  		transform: 'rotate('+angle+'deg)',
	  		top: y1 < y2 ? y1 : y1 - (y1-y2),
	  		left: x1 < x2 ? x1 : x1 - (x1-x2)
		}
	}
});