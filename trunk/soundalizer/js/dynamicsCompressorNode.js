var DynamicsCompressorNode = BaseNode.extend({
  	init: function(index){
		this._super(index);
		this.thingy = context.createDynamicsCompressor();
		this.name = "dynamicscompressor" + this.idx;
		var el = this.createMainEl();
		var dynCmpN = this.thingy;
		
		var setThresholdFnc = function(v) { dynCmpN.threshold.value = v; };
		var setAttackFnc = function(v) { dynCmpN.attack.value = v; };
		var setReleaseFnc = function(v) { dynCmpN.release.value = v; };
		
		var thresRange = $('<input>');
		thresRange.attr({
			type: 'range',
			min: dynCmpN.threshold.minValue,
			max: dynCmpN.threshold.maxValue,
			value: dynCmpN.threshold.defaultValue
		});
		thresRange.on('change', function() {
			setThresholdFnc(this.value)
		});
		el.append(thresRange);
		setThresholdFnc(thresRange.val());
		
		var attackRange = $('<input>');
		attackRange.attr({
			type: 'range',
			min: dynCmpN.attack.minValue,
			max: dynCmpN.attack.maxValue,
			step: '0.01',
			value: dynCmpN.attack.defaultValue
		});
		attackRange.on('change', function() {
			setAttackFnc(this.value)
		});
		el.append(attackRange);
		setAttackFnc(attackRange.val());
		
		var releaseRange = $('<input>');
		releaseRange.attr({
			type: 'range',
			min: dynCmpN.release.minValue,
			max: dynCmpN.release.maxValue,
			step: '0.01',
			value: dynCmpN.release.defaultValue
		});
		releaseRange.on('change', function() {
			setReleaseFnc(this.value)
		});
		el.append(releaseRange);
		setReleaseFnc(releaseRange.val());
	}
});