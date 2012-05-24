var BiquadFilterNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.shortName = "bfn";
		this.thingy = context.createBiquadFilter();
		this.name = "Pass";
		this.icon = "icon-signal";
		this.tooltip = "Lets different frequencies of the audio input through";
		var el = this.createMainEl(true, true, true, 231);
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
  		
  		var setFrequencyFnc = function(el, v) {
  			var minValue = 30;
  			var maxValue = context.sampleRate / 2;
  			// Logarithm (base 2) to compute how many octaves fall in the range.
  			var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  			// Compute a multiplier from 0 to 1 based on an exponential scale.
  			var multiplier = Math.pow(2, numberOfOctaves * (v.value - 1.0));
  			// Get back to the frequency value between min and max.
  			biqN.frequency.value = maxValue * multiplier;
  			freqLabel.html('Frequency ' + Math.floor(biqN.frequency.value) + ' Hz');
  		};
  		
  		var setQFnc = function(el, v) { 
  			biqN.Q.value = v.value * 30; 
  			qLabel.html('Quality ' + Math.floor(biqN.Q.value));
  		};
	    		
		var selectEl = $('<select>');
		selectEl.append($('<option>').html("lowpass"));
		selectEl.append($('<option>').html("highpass"));
		selectEl.append($('<option>').html("bandpass"));
		selectEl.on('change', function() {
			setTypeFnc(this.value);
		});
		el.append($('<a href="#" rel="tooltip" title="Type of pass effect">').tooltip().html('Type'));
		el.append(selectEl);
		el.append($('<br/>'));
		el.append($('<br/>'));
		setTypeFnc(selectEl.val());
		
		var freqRange = $('<div>');
		var freqLabel = $('<a href="#" rel="tooltip" title="The cutoff frequency">').tooltip();
		freqRange.slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: 0.8,
			slide: setFrequencyFnc
		});
		el.append(freqLabel);
		el.append(freqRange);
		el.append($('<br/>'));
		setFrequencyFnc(null, {value:0.8});
		
		var qRange = $('<div>');
		var qLabel = $('<a href="#" rel="tooltip" title="Controls how peaked the response will be at the cutoff frequency">').tooltip();
		qRange.slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: 0.2,
			slide: setQFnc
		});
		el.append(qLabel);
		el.append(qRange);
		setQFnc(null, {value:0.2});
	}	
});