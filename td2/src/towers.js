TD.Tower = TD.Displayable.extend({
	init: function(parent, textureSrc, pos, bulletName, bulletOffset, shotDelay, range) {
		this._super(parent, textureSrc, pos);
		this.range = range;
		this.shotDelay = shotDelay;
		this.bullets = [];
		this.bulletName = bulletName;
		
		var that = this;

		setInterval(function() {

			var target;
			for (var i in TD.monsters) {
				var dist = distance(that.sprite.position, TD.monsters[i].sprite.position);
				if (dist.d < that.range && TD.monsters[i].dying === false) {
					if (!target || target.tween.ratio < TD.monsters[i].tween.ratio) {
						target = TD.monsters[i];
					}
				}
			}

			if (target) {
				TD.createBulletInstance(that.bulletName, that.parent, {x: that.sprite.position.x + bulletOffset.x, y: that.sprite.position.y + bulletOffset.y}, target);
			}

		}, this.shotDelay + (Math.random()*100));
	},

});

TD.Tower1 = TD.Tower.extend({
	init: function(parent, pos) {
		this._super(parent, 'img/towers/tower1.png', pos, 'CannonBall', {x: 10, y: 10}, 1000, 200);
	}
});