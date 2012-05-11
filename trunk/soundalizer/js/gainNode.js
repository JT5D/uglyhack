var GainNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createGainNode();
		this.name = "gain" + this.idx;
	    var el = this.createMainEl(true, true);
	    var gainN = this.thingy;
	    
	    var setVolumeFnc = function(vol) {
			var fraction = parseInt(vol) / parseInt(100);
			// Let's use an x*x curve (x-squared) since simple linear (x) does not sound as good.
			gainN.gain.value = fraction * fraction;
		} 
		
		var gainRange = $('<input>');
		gainRange.attr({
			type: 'range',
			min: '0',
			max: '200',
			value: '100'
		});
		gainRange.on('change', function() {
			setVolumeFnc(this.value);
		});
		el.append(gainRange);
		setVolumeFnc(gainRange.val());
	}
});