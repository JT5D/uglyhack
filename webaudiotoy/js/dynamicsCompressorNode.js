var DynamicsCompressorNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createDynamicsCompressor();
		this.name = "Dynamic Compr";
		this.icon = "icon-bullhorn";
		var el = this.createMainEl(true, true, true, 207);
		var dynCmpN = this.thingy;
		
		var setThresholdFnc = function(el, v) {
			dynCmpN.threshold.value = v.value;
			thresLabel.html('Threshold ' + v.value + ' dB');
		};
		var setAttackFnc = function(el, v) { 
			dynCmpN.attack.value = v.value;
			attackLabel.html('Attack ' + v.value + ' s');
		};
		var setReleaseFnc = function(el, v) { 
			dynCmpN.release.value = v.value;
			releaseLabel.html('Release ' + v.value + ' s');
		};
		
		var thresRange = $('<div>');
		var thresLabel = $('<p>');
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
		
		var attackRange = $('<div>');
		var attackLabel = $('<p>');
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
		var releaseLabel = $('<p>');
		releaseRange.slider({
			min: dynCmpN.release.minValue,
			max: dynCmpN.release.maxValue,
			step: 0.01,
			value: 0.25,
			slide: setReleaseFnc
		});
		el.append(releaseLabel);
		el.append(releaseRange);
		setReleaseFnc(null, { value: 0.25});
	}
});