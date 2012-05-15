var GainNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createGainNode();
		this.name = "gain";
	    var el = this.createMainEl(true, true, true);
	    var gainN = this.thingy;
	    
	    var setVolumeFnc = function(el, v) {
			gainN.gain.value = v.value * v.value;
			gainLabel.html('Volume ' + v.value);
		} 
		
		var gainRange = $('<div>');
		var gainLabel = $('<p>');
		gainRange.slider({
			min: 0,
			max: 3,
			value: 1,
			step: 0.01,
			slide: setVolumeFnc
		});
		el.append(gainLabel);
		el.append(gainRange);
		setVolumeFnc(null, {value: 1});
	}
});