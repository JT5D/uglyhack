var PianoNode = BaseNode.extend({
  	init: function(index, config){
		this._super(index, config);
		this.shortName = "pn";
		this.name = "Piano";
		this.icon = " icon-play";
		this.tooltip = "Play piano on your keyboard, using an oscillator";
		this.deleted = false;
		var el = this.createMainEl(true, false, true, 170);
		try {
			this.thingy = context.createOscillator();
		} catch(e) {
			el.append($('<p>').html('Not supported by your browser. You probably need to go Chrome Canary.'));
			return;
		}
  		var thisNode = this;

  		if(!config) {
  			this.c = {
  				t: "sine",
  				d: 0,
  				o: 2
  			};
  		}

  		var pianoNotes = this.pianoNotes = {};

  		var shutupFnc = this.shutupFnc = function(node) {
  			if(!node) return;
  			node.noteOff(0);
			for(var i in thisNode.myConnections) {
				var n = thisNode.myConnections[i];
				var conns = n.getConnections();
				for(var i in conns) {
					node.disconnect(conns[i]);
				}
			}
  		}

  		var soundFnc = function() {
  			var node = context.createOscillator()
  			for(var i in thisNode.myConnections) {
				var n = thisNode.myConnections[i];
				var conns = n.getConnections();
				for(var i in conns) {
					node.connect(conns[i]);
				}
			}
			node.noteOn(0);
			return node;
  		}
  		
  		var setTypeFnc = function(v) {
  			thisNode.c.t = v;
  			var t = null;
  			switch(v) {
  				case "sine":
  					t = thisNode.thingy.SINE;
  				break;
  				case "square":
  					t = thisNode.thingy.SQUARE;
  				break;
  				case "sawtooth":
  					t = thisNode.thingy.SAWTOOTH;
  				break;
  				case "triangle":
  					t = thisNode.thingy.TRIANGLE;
  				break;
  			}
  			if(t) {
	  			for(var i in pianoNotes) {
	  				if(pianoNotes[i]) pianoNotes[i].type = t;
	  			}
	  		}
  		};

  		var setOctaveFnc = function(el, v) {
  			thisNode.c.o = v.value;
  			octaveLabel.html('Octave ' + v.value);
  		}
  		
  		var setDetuneFnc = function(el, v) {
  			thisNode.c.d = v.value;
  			for(var i in pianoNotes) {
  				if(pianoNotes[i]) pianoNotes[i].detune.value = v.value;
  			}
			detuneLabel.html('Detune ' + v.value + ' Cents');
  		}

		var pf =  {
			Z: 65.406,
			S: 69.296,
			X: 73.416,
			D: 77.782,
			C: 82.407,
			V: 87.307,
			G: 92.499,
			B: 97.999,
			H: 103.826,
			N: 110.000,
			J: 116.541,
			M: 123.471,
			Q: 65.406*2,
			'2': 69.296*2,
			W: 73.416*2,
			'3': 77.782*2,
			E: 82.407*2,
			R: 87.307*2,
			'5': 92.499*2,
			T: 97.999*2,
			'6': 103.826*2,
			Y: 110.000*2,
			'7': 116.541*2,
			U: 123.471*2 
		};

		this.onkeydown = function(e) {
			if(thisNode.deleted) return;

			var note = String.fromCharCode(e.keyCode);
			if(!pianoNotes[note]) {
				if(pf[note]) {
					pianoNotes[note] = soundFnc();
					pianoNotes[note].frequency.value = pf[note] * thisNode.c.o;
					setTypeFnc(thisNode.c.t);
					setDetuneFnc(null, {value:thisNode.c.d});
				}
			}
		};

		this.onkeyup = function(e) {
			if(thisNode.deleted) return;

			var note = String.fromCharCode(e.keyCode);
			shutupFnc(pianoNotes[note]);
			pianoNotes[note] = null;
		};
  		
		var selectEl = $('<select>');
		selectEl.append($('<option>').html("sine"));
		selectEl.append($('<option>').html("square"));
		selectEl.append($('<option>').html("sawtooth"));
		selectEl.append($('<option>').html("triangle"));
		selectEl.val(this.c.t)
		selectEl.on('change', function() {
			setTypeFnc(this.value);
		});
		el.append($('<a href="#" rel="tooltip" title="The shape of the periodic waveform">').tooltip().html('Type'));
		el.append(selectEl);
		el.append($('<br/>'));
		setTypeFnc(this.c.t);

		var octaveRange = $('<div>');
		var octaveLabel = $('<a href="#" rel="tooltip" title="Select the octave of the piano">').tooltip();
		octaveRange.slider({
			min: 1,
			max: 6,
			step: 1,
			value: this.c.o,
			slide: setOctaveFnc
		});
		el.append(octaveLabel);
		el.append(octaveRange);
		setOctaveFnc(null, {value:this.c.o});
		
		var detuneRange = $('<div>');
		var detuneLabel = $('<a href="#" rel="tooltip" title="A detuning value which will offset the frequency by the given amount">').tooltip();
		detuneRange.slider({
			min: -100,
			max: 100,
			step: 1,
			value: this.c.d,
			slide: setDetuneFnc
		});
		el.append(detuneLabel);
		el.append(detuneRange);
		setDetuneFnc(null, {value:this.c.d});

	},
	shutdown: function() {
		for(var i in this.pianoNotes) {
			this.shutupFnc(this.pianoNotes[i]);
		}
		this.deleted = true;
	}
});