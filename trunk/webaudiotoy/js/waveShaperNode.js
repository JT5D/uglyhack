var WaveShaperNode = BaseNode.extend({
  	init: function(index){
	    this._super(index);
		this.thingy = context.createWaveShaper();
		this.name = "WaveShaper";
		this.icon = "icon-tasks";
		this.tooltip = "Implements non-linear distortion effects";
		var el = this.createMainEl(true, true, true, 167);
		var shaperN = this.thingy;
		
		var setCurveFnc = function(l, v) { 
			var curve = new Float32Array(10);
			var idx = 0;
			$(el).find('.curveRange').each(function() {
				curve[idx++] = $(this).slider("value");
			});
			shaperN.curve = curve;
		}; 
		
		el.append($('<a href="#" rel="tooltip" title="The shaping curve used for the waveshaping effect">').tooltip().html('Curve'));
		el.append($('<br/>'));

		for(var i = 0; i < 10; i++) {
			var curveRange = $('<div>');
			curveRange.slider({
				orientation: "vertical",
				min: -1,
				max: 1,
				step: 0.01,
				value: i*0.05,
				slide: setCurveFnc
			});
			curveRange.addClass('curveRange');
			el.append(curveRange);
		}

		setCurveFnc(null, null);
	}
	
});