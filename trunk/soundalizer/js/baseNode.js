var BaseNode = Class.extend({
	init: function(index){
    	this.idx = index;
    	this.myConnections = new Array();
  	},
  	createMainEl: function() {
  		var el = $('<div>');
		el.addClass('node');
		el.html(this.name);
		el.draggable({
			stack: 'div.node'
		});
		$('body').append(el);
		return el;
  	},
  	connectTo: function(node) {
		var conns = node.getConnections();
		for(var i in conns) {
			this.thingy.connect(conns[i]);
		}
		this.myConnections.push(node);
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
	}
});