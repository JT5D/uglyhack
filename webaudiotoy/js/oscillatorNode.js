var OscillatorNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.name = "Oscillator";
		this.icon = " icon-chevron-up";
		this.tooltip = "Oscillator represents an audio source generating a periodic waveform";
		var el = this.createMainEl(true, false, true, 185);
		try {
			this.thingy = context.createOscillator();
		} catch(e) {
			el.append($('<p>').html('Not supported by your browser'));
			return;
		}
  		var oscN = this.thingy;
  		
  		var setTypeFnc = function(v) {
  			switch(v) {
  				case "sine":
  					oscN.type = oscN.SINE;
  				break;
  				case "square":
  					oscN.type = oscN.SQUARE;
  				break;
  				case "sawtooth":
  					oscN.type = oscN.SAWTOOTH;
  				break;
  				case "triangle":
  					oscN.type = oscN.TRIANGLE;
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
  			oscN.frequency.value = maxValue * multiplier;
  			freqLabel.html('Frequency ' + Math.floor(oscN.frequency.value) + ' Hz');
  		};
  		
  		var setDetuneFnc = function(el, v) {
  			oscN.detune.value = v.value;
			detuneLabel.html('Detune ' + v.value + ' Cents');
  		}
  		
		var selectEl = $('<select>');
		selectEl.append($('<option>').html("sine"));
		selectEl.append($('<option>').html("square"));
		selectEl.append($('<option>').html("sawtooth"));
		selectEl.append($('<option>').html("triangle"));
		selectEl.on('change', function() {
			setTypeFnc(this.value);
		});
		el.append($('<a href="#" rel="tooltip" title="The shape of the periodic waveform">').tooltip().html('Type'));
		el.append(selectEl);
		el.append($('<br/>'));
		setTypeFnc(selectEl.val());
		
		var freqRange = $('<div>');
		var freqLabel = $('<a href="#" rel="tooltip" title="The frequency of the periodic waveform.">').tooltip();
		freqRange.slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: 0.1,
			slide: setFrequencyFnc
		});
		el.append(freqLabel);
		el.append(freqRange);
		el.append($('<br/>'));
		setFrequencyFnc(null, {value:0.1});
		
		var detuneRange = $('<div>');
		var detuneLabel = $('<a href="#" rel="tooltip" title="A detuning value which will offset the frequency by the given amount">').tooltip();
		detuneRange.slider({
			min: -100,
			max: 100,
			step: 1,
			value: 0,
			slide: setDetuneFnc
		});
		el.append(detuneLabel);
		el.append(detuneRange);
		setDetuneFnc(null, {value:0});

		oscN.noteOn(0);
	}	
});