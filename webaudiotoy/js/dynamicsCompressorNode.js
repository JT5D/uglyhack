var DynamicsCompressorNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createDynamicsCompressor();
		this.name = "Dynamic Compr";
		this.icon = "icon-bullhorn";
		this.tooltip = "Dynamics compression is very commonly used in musical production and game audio. It lowers the volume of the loudest parts of the signal and raises the volume of the softest parts";
		var el = this.createMainEl(true, true, true, 306);
		var dynCmpN = this.thingy;
		
		var setThresholdFnc = function(el, v) {
			dynCmpN.threshold.value = v.value;
			thresLabel.html('Threshold ' + v.value + ' dB');
		};
		var setKneeFnc = function(el, v) {
			dynCmpN.knee.value = v.value;
			kneeLabel.html('Knee ' + v.value + ' dB');
		};
		var setRatioFnc = function(el, v) { 
			dynCmpN.ratio.value = v.value;
			ratioLabel.html('Ratio ' + v.value);
		};
		var setAttackFnc = function(el, v) { 
			dynCmpN.attack.value = v.value;
			attackLabel.html('Attack ' + v.value + ' s');
		};
		var setReleaseFnc = function(el, v) { 
			dynCmpN.release.value = v.value;
			releaseLabel.html('Release ' + v.value + ' s');
		};

		if(dynCmpN.threshold == undefined || dynCmpN.attack == undefined || dynCmpN.release == undefined) {
			el.append($('<p>').html('Not supported by your browser'));
			return;
		}
		
		var thresRange = $('<div>');
		var thresLabel = $('<a href="#" rel="tooltip" title="The decibel value above which the compression will start taking effect">').tooltip();
		thresRange.slider({
			min: dynCmpN.threshold.minValue,
			max: dynCmpN.threshold.maxValue,
			value: dynCmpN.threshold.defaultValue,
			slide: setThresholdFnc
			
		});
		el.append(thresLabel);
		el.append(thresRange);
		el.append($('<br/>'));
		setThresholdFnc(null, { value: dynCmpN.threshold.defaultValue});

		var kneeRange = $('<div>');
		var kneeLabel = $('<a href="#" rel="tooltip" title="A decibel value representing the range above the threshold where the curve smoothly transitions to the "ratio" portion">').tooltip();
		kneeRange.slider({
			min: dynCmpN.knee.minValue,
			max: dynCmpN.knee.maxValue,
			value: dynCmpN.knee.defaultValue,
			slide: setKneeFnc
			
		});
		el.append(kneeLabel);
		el.append(kneeRange);
		el.append($('<br/>'));
		setKneeFnc(null, { value: dynCmpN.knee.defaultValue});

		var ratioRange = $('<div>');
		var ratioLabel = $('<a href="#" rel="tooltip" title="The ratio of compression">').tooltip();
		ratioRange.slider({
			min: dynCmpN.ratio.minValue,
			max: dynCmpN.ratio.maxValue,
			value: dynCmpN.ratio.defaultValue,
			slide: setRatioFnc
			
		});
		el.append(ratioLabel);
		el.append(ratioRange);
		el.append($('<br/>'));
		setRatioFnc(null, { value: dynCmpN.ratio.defaultValue});

		
		var attackRange = $('<div>');
		var attackLabel = $('<a href="#" rel="tooltip" title="The amount of time to increase the gain by 10dB.">').tooltip();
		attackRange.slider({
			min: dynCmpN.attack.minValue,
			max: dynCmpN.attack.maxValue,
			step: 0.01,
			value: 0.1,
			slide: setAttackFnc
		});
		el.append(attackLabel);
		el.append(attackRange);
		el.append($('<br/>'));
		setAttackFnc(null, { value: 0.1});
		
		var releaseRange = $('<div>');
		var releaseLabel = $('<a href="#" rel="tooltip" title="The amount of time to reduce the gain by 10dB">').tooltip();
		releaseRange.slider({
			min: dynCmpN.release.minValue,
			max: dynCmpN.release.maxValue,
			step: 0.01,
			value: 0.25,
			slide: setReleaseFnc
		});
		el.append(releaseLabel);
		el.append(releaseRange);
		el.append($('<br/>'));
		setReleaseFnc(null, { value: 0.25});

		var reductionLabel = $('<p>')
		setInterval(function() {
			reductionLabel.html('Reduction ' + Math.min(dynCmpN.reduction.value.toPrecision(2), -0.1) + ' dB');
		},100);
		el.append($('<a href="#" rel="tooltip" title="Current amount of gain reduction">').tooltip().append(reductionLabel));
	}
});