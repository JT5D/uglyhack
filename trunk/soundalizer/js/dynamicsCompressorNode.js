var DynamicsCompressorNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createDynamicsCompressor();
		this.name = "dynamicscompressor" + this.idx;
	    
	    var el = document.createElement('div');
		el.setAttribute('class', 'node');
		el.innerHTML = this.name;
		document.body.appendChild(el);
		
		var thresRange = document.createElement('input');
		thresRange.setAttribute('type', 'range');
		thresRange.setAttribute('min', this.thingy.threshold.minValue);
		thresRange.setAttribute('max', this.thingy.threshold.maxValue);
		thresRange.setAttribute('value', this.thingy.threshold.defaultValue);
		thresRange.setAttribute('onchange', 'nodes[' + this.idx + '].setThreshold(this);');
		el.appendChild(thresRange);
		
		var attackRange = document.createElement('input');
		attackRange.setAttribute('type', 'range');
		attackRange.setAttribute('min', this.thingy.attack.minValue);
		attackRange.setAttribute('max', this.thingy.attack.maxValue);
		attackRange.setAttribute('value', this.thingy.attack.defaultValue);
		attackRange.setAttribute('step', '0.01');
		attackRange.setAttribute('onchange', 'nodes[' + this.idx + '].setAttack(this);');
		el.appendChild(attackRange);
		
		var releaseRange = document.createElement('input');
		releaseRange.setAttribute('type', 'range');
		releaseRange.setAttribute('min', this.thingy.release.minValue);
		releaseRange.setAttribute('max', this.thingy.release.maxValue);
		releaseRange.setAttribute('value', this.thingy.release.defaultValue);
		releaseRange.setAttribute('step', '0.01');
		releaseRange.setAttribute('onchange', 'nodes[' + this.idx + '].setRelease(this);');
		el.appendChild(releaseRange);

	},
	setThreshold: function(input) {
		this.thingy.threshold.value = input.value;
		return this;
	},
	setAttack: function(input) {
		this.thingy.attack.value = input.value;
		return this;
	},
	setRelease: function(input) {
		this.thingy.release.value = input.value;
		return this;
	}
});