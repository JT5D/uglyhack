var ConvolverNode = BaseNode.extend({
  	init: function(index){
  		this._super(index);
  		this.thingy = context.createConvolver();
  		this.name = "convolver" + this.idx;
  		
  		var el = document.createElement('div');
		el.setAttribute('class', 'node');
		el.innerHTML = this.name;
		document.body.appendChild(el);
		
		var selectEl = document.createElement('select');
		selectEl.setAttribute('onchange', 'nodes[' + this.idx + '].setConv(this);');
		var optionEl = document.createElement('option');
		optionEl.innerHTML = "cardiod-rear-levelled";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "comb-saw1";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "comb-saw2";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "cosmic-ping-long";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "diffusor3";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "dining-far-kitchen";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "dining-living-true-stereo";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "feedback-spring";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "filter-lopass160";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "filter-rhythm1";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "filter-rhythm3";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "filter-telephone";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "impulse-rhythm2";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "kitchen";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "kitchen-true-stereo";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "living-bedroom-leveled";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "matrix6-backwards";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "matrix-reverb2";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "matrix-reverb3";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "s2_r4_bd";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "spatialized4";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "spatialized5";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "spreader50-65ms";
		selectEl.appendChild(optionEl);
		optionEl = document.createElement('option');
		optionEl.innerHTML = "wildecho";
		selectEl.appendChild(optionEl);
		
		el.appendChild(selectEl);
		this.setConv(selectEl);
  	},
  	setConv: function(input) {
		var request = new XMLHttpRequest();
	    request.open("GET", "conv/" + input.value + ".wav", true);
	    request.responseType = "arraybuffer";
	    var cc = this.thingy;
	    
	    request.onload = function() {
		    cc.buffer = context.createBuffer(request.response, false);
	    }
	    request.send();
	}
});