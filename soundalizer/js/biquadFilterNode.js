var BiquadFilterNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createBiquadFilter();
		this.thingy.type = this.thingy.LOWPASS;
		this.name = "biquadFilter" + this.idx;
	    

	    var el = document.createElement('div');
		el.setAttribute('class', 'node');
		el.innerHTML = this.name;
		document.body.appendChild(el);
		
		var selectEl = document.createElement('select');
		selectEl.setAttribute('onchange', 'nodes[' + this.idx + '].setType(this);');
		var optionEl = document.createElement('option');
		optionEl.innerHTML = "lowpass";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "highpass";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "bandpass";
		selectEl.appendChild(optionEl);
		el.appendChild(selectEl);
		
		var freqRange = document.createElement('input');
		freqRange.setAttribute('type', 'range');
		freqRange.setAttribute('min', '0');
		freqRange.setAttribute('max', '1');
		freqRange.setAttribute('step', '0.01');
		freqRange.setAttribute('value', '1');
		freqRange.setAttribute('onchange', 'nodes[' + this.idx + '].setFrequency(this);');
		el.appendChild(freqRange);
		
		var qRange = document.createElement('input');
		qRange.setAttribute('type', 'range');
		qRange.setAttribute('min', '0');
		qRange.setAttribute('max', '1');
		qRange.setAttribute('step', '0.01');
		qRange.setAttribute('value', '0');
		qRange.setAttribute('onchange', 'nodes[' + this.idx + '].setQ(this);');
		el.appendChild(qRange);
		
		this.setFrequency(freqRange);
		this.setQ(qRange);

	},
	setType: function(input) {
		switch(input.value) {
			case "highpass":
				this.thingy.type = this.thingy.HIGHPASS;
			break;
			case "lowpass":
				this.thingy.type = this.thingy.LOWPASS;
			break;
			case "bandpass":
				this.thingy.type = this.thingy.BANDPASS;
			break;
		}
		return this;
	},
	setFrequency: function(input) {
		var minValue = 40;
		var maxValue = context.sampleRate / 2;
		// Logarithm (base 2) to compute how many octaves fall in the range.
		var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
		// Compute a multiplier from 0 to 1 based on an exponential scale.
		var multiplier = Math.pow(2, numberOfOctaves * (input.value - 1.0));
		// Get back to the frequency value between min and max.
		this.thingy.frequency.value = maxValue * multiplier;
		return this;
	},
	setQ: function(input) {
		this.thingy.Q.value = input.value * 30;
		return this;
	}
});