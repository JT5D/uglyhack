var DelayNode = BaseNode.extend({
  	init: function(index){
	    this._super(index);
		this.thingy = context.createDelayNode();
		this.name = "delay" + this.idx;

		var el = document.createElement('div');
		el.setAttribute('class', 'node');
		el.innerHTML = this.name;
		document.body.appendChild(el);
		
		var delayRange = document.createElement('input');
		delayRange.setAttribute('type', 'range');
		delayRange.setAttribute('min', '0');
		delayRange.setAttribute('max', '0.99');
		delayRange.setAttribute('step', '0.01');
		delayRange.setAttribute('value', '0.99');
		delayRange.setAttribute('onchange', 'nodes[' + this.idx + '].setDelay(this);');
		el.appendChild(delayRange);
		this.setDelay(delayRange);

	},
	setDelay: function(input) {
		this.thingy.delayTime.value = input.value;
		return this;
	} 
});