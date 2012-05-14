var BiquadFilterNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createBiquadFilter();
		this.name = "biquadFilter";
		var el = this.createMainEl(true, true, true);
  		var biqN = this.thingy;
  		
  		var setTypeFnc = function(v) {
  			switch(v) {
  				case "highpass":
  					biqN.type = biqN.HIGHPASS;
  				break;
  				case "lowpass":
  					biqN.type = biqN.LOWPASS;
  				break;
  				case "bandpass":
  					biqN.type = biqN.BANDPASS;
  				break;
  			}
  		};
  		
  		var setFrequencyFnc = function(v) {
  			var minValue = 40;
  			var maxValue = context.sampleRate / 2;
  			// Logarithm (base 2) to compute how many octaves fall in the range.
  			var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  			// Compute a multiplier from 0 to 1 based on an exponential scale.
  			var multiplier = Math.pow(2, numberOfOctaves * (v - 1.0));
  			// Get back to the frequency value between min and max.
  			biqN.frequency.value = maxValue * multiplier;
  		};
  		
  		var setQFnc = function(v) { biqN.Q.value = v * 30; };
	    		
		var selectEl = $('<select>');
		selectEl.append($('<option>').html("lowpass"));
		selectEl.append($('<option>').html("highpass"));
		selectEl.append($('<option>').html("bandpass"));
		selectEl.on('change', function() {
			setTypeFnc(this.value);
		});
		el.append(selectEl);
		setTypeFnc(selectEl.val());
		
		var freqRange = $('<input>');
		freqRange.attr({
			type: 'range',
			min: '0',
			max: '1',
			step: '0.01',
			value: '1'
		});
		freqRange.on('change', function() {
			setFrequencyFnc(this.value)
		});
		el.append(freqRange);
		setFrequencyFnc(freqRange.val());
		
		var qRange = $('<input>');
		qRange.attr({
			type: 'range',
			min: '0',
			max: '1',
			step: '0.01',
			value: '0'
		});
		qRange.on('change', function() {
			setQFnc(this.value)
		});
		el.append(qRange);
		setQFnc(qRange.val());
	}	
});