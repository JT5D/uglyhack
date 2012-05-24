var GainNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.shortName = "gn";
		this.thingy = context.createGainNode();
		this.name = "Gain";
		this.icon = "icon-plus";
		this.tooltip = "Changes the gain of (scales) the incoming audio signal by a certain amount";
	    var el = this.createMainEl(true, true, true, 90);
	    var gainN = this.thingy;
	    
	    var setVolumeFnc = function(el, v) {
			gainN.gain.value = v.value * v.value;
			gainLabel.html('Volume ' + v.value);
		} 
		
		var gainRange = $('<div>');
		var gainLabel = $('<a href="#" rel="tooltip" title="Set gain multiplier">').tooltip();
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