TD.createBulletInstance = function(name, parent, pos, target) {

	var bullet;
	switch (name) {
		case 'CannonBall':
			bullet =  new TD.CannonBall(parent, pos, target);
	}

	TD.bullets.push(bullet);
}

TD.Bullet = TD.Displayable.extend({
	init: function(parent, textureSrc, target, pos, speed) {
		this._super(parent, textureSrc, pos);
		this.target = target;
		this.speed = speed;
	},
	updatePosition: function() {

		if (TD.monsters.indexOf(this.target) == -1) {
			if (this.parent.children.indexOf(this.sprite) != -1) { this.parent.removeChild(this.sprite); }
        	TD.bullets.splice(TD.bullets.indexOf(this), 1);			
		}

		var mx = this.sprite.position.x;
		var my = this.sprite.position.y;

		var tx = this.target.sprite.position.x;
		var ty = this.target.sprite.position.y;

		var dx = tx-mx;
		var dy = ty-my;
		var d = Math.sqrt(dx*dx + dy*dy);

		if (d < this.speed * 2) {

			if (this.parent.children.indexOf(this.sprite) != -1) { this.parent.removeChild(this.sprite); }
        	TD.bullets.splice(TD.bullets.indexOf(this), 1);

        	this.target.hit(this);

		} else {
			this.sprite.position.x = mx + this.speed * (dx/d);
			this.sprite.position.y = my + this.speed * (dy/d);
		}
	}
});

TD.CannonBall = TD.Bullet.extend({
	init: function(parent, pos, target) {
		this._super(parent, 'img/bullets/cannon_ball.png', target, pos, 4);
	}
});