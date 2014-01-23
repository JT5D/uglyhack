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
		this.alive = true;
	},
	updatePosition: function() {

		if (TD.monsters.indexOf(this.target) == -1) {
			this.alive = false;
		}

		var d = distance(this.sprite.position, this.target.sprite.position);

		if (d.d < this.speed * 2) {

			this.alive = false;
        	this.target.hit(this);

		} else {

			this.sprite.position.x -= this.speed * (d.dx/d.d);
			this.sprite.position.y -= this.speed * (d.dy/d.d);
		}
	}
});

TD.CannonBall = TD.Bullet.extend({
	init: function(parent, pos, target) {
		this._super(parent, 'img/bullets/cannon_ball.png', target, pos, 7);
	}
});