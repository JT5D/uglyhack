var GainNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createGainNode();
		this.name = "gain";
	    var el = this.createMainEl(true, true, true);
	    var gainN = this.thingy;
	    
	    var setVolumeFnc = function(el, valueObj) {
			var fraction = valueObj.value / 100;
			// Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
			gainN.gain.value = fraction * fraction;
		} 
		
	    var defaultVal = 100;
		var gainRange = $('<div>');
		gainRange.slider({
			min: '0',
			max: '200',
			value: 100,
			slide: setVolumeFnc
		});
		el.append($('<p>').html('Volume'));
		el.append(gainRange);
		setVolumeFnc(null, defaultVal);
	}
});