var GainNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createGainNode();
		this.name = "gain" + this.idx;
	    
		var el = document.createElement('div');
		el.setAttribute('class', 'node');
		el.innerHTML = this.name;
		document.body.appendChild(el);
		
		var gainRange = document.createElement('input');
		gainRange.setAttribute('type', 'range');
		gainRange.setAttribute('min', '0');
		gainRange.setAttribute('max', '200');
		gainRange.setAttribute('value', '100');
		gainRange.setAttribute('onchange', 'nodes[' + this.idx + '].setVolume(this);');
		el.appendChild(gainRange);
		this.setVolume(gainRange);
	},
	setVolume: function(input) {
		var fraction = parseInt(input.value) / parseInt(100);
		// Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
		this.thingy.gain.value = fraction * fraction;
		return this;
	} 
});