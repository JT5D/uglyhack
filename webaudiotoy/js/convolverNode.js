var ConvolverNode = BaseNode.extend({
  	init: function(index){
  		this._super(index);
  		this.thingy = context.createConvolver();
  		this.name = "convolver";
  		var el = this.createMainEl(true, true, true, 106);
  		var convN = this.thingy;
  		var thisNode = this;
  		
  		var setConvFnc = function(v) {
  			thisNode.loader.fadeIn('fast');
  			var request = new XMLHttpRequest();
  		    request.open("GET", "conv/" + v + ".wav", true);
  		    request.responseType = "arraybuffer";
  		    
  		    request.onload = function() {
  		    	convN.buffer = context.createBuffer(request.response, false);
  		    	thisNode.loader.fadeOut('fast');
  		    }
  		    request.send();
  		};
  		
		var sEl = $('<select>');
		sEl.on('change', function() {
			setConvFnc(this.value);
		});
		sEl.append($('<option>').html("cardiod-rear-levelled"));
		sEl.append($('<option>').html("comb-saw1"));
		sEl.append($('<option>').html("comb-saw2"));
		sEl.append($('<option>').html("cosmic-ping-long"));
		sEl.append($('<option>').html("diffusor3"));
		sEl.append($('<option>').html("dining-far-kitchen"));
		sEl.append($('<option>').html("dining-living-true-stereo"));
		sEl.append($('<option>').html("feedback-spring"));
		sEl.append($('<option>').html("filter-lopass160"));
		sEl.append($('<option>').html("filter-rhythm1"));
		sEl.append($('<option>').html("filter-rhythm3"));
		sEl.append($('<option>').html("filter-telephone"));
		sEl.append($('<option>').html("impulse-rhythm2"));
		sEl.append($('<option>').html("kitchen"));
		sEl.append($('<option>').html("kitchen-true-stereo"));
		sEl.append($('<option>').html("living-bedroom-leveled"));
		sEl.append($('<option>').html("matrix6-backwards"));
		sEl.append($('<option>').html("matrix-reverb2"));
		sEl.append($('<option>').html("matrix-reverb3"));
		sEl.append($('<option>').html("s2_r4_bd"));
		sEl.append($('<option>').html("spatialized4"));
		sEl.append($('<option>').html("spatialized5"));
		sEl.append($('<option>').html("spreader50-65ms"));
		sEl.append($('<option>').html("wildecho"));

		el.append($('<p>').html('Impulse response'));
		el.append(sEl);
		setConvFnc(sEl.val());
  	}
  	
});