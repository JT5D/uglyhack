var BaseNode = Class.extend({
	init: function(index){
    	this.idx = index;
    	this.myConnections = new Array();
  	},
  	createMainEl: function(createDrag, createDrop, createclose) {
  		var thisNode = this;
  		var el = this.el = $('<div>');
		el.addClass('node');
		el.draggable({
			stack: 'div.node',
			drag: function() {
				thisNode.updateConnectionLines();
			},
		});
		
		//create header
		var header = $('<div>');
		header.addClass('nodeheader');
		header.html(this.name);
		el.append(header);
		if(createclose) {
			var closeBtn = $('<div>');
			closeBtn.addClass('close');
			closeBtn.html('x');
			closeBtn.on('click', function() {
				for(var i in thisNode.myConnections) {
					thisNode.disconnectFrom(thisNode.myConnections[i]);
				}
				$('.line').each(function() {
					var line = $(this);
					var lineFromIdx = line.attr('data-fromIdx');
					var lineToIdx = line.attr('data-toIdx');
					if(lineFromIdx == thisNode.idx || lineToIdx == thisNode.idx) {
						line.remove();
					}
					thisNode.el.remove();
				});
			});
		}
		header.append(closeBtn);
		
		if(createDrag) {
			var dragEl = $('<div>');
			var tempConnectionLine = null;
			dragEl.draggable({
				revert: true,
				snap: '.nodedrop',
				start: function() {
					tempConnectionLine = thisNode.createConnectionLine(thisNode.el, dragEl, null, null, true)
				},
				drag: function() {
					var linePosData = thisNode.getLinePosData(thisNode.el, dragEl, true);
					thisNode.updateConnectionLine(tempConnectionLine, linePosData);
				},
				stop: function() {
					tempConnectionLine.remove();
				}
			});
			dragEl.addClass('nodedrag');
			dragEl.addClass('nodehandle');
			dragEl.attr('data-nodeIndex', this.idx);
			el.append(dragEl);
		}

		if(createDrop) {
			
			var dropEl = $('<div>');
			dropEl.addClass('nodedrop');
			dropEl.addClass('nodehandle');
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
			x2 += 10;
		} else {
			x1 += 25;
			x2 -= 15;
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