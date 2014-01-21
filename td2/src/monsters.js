TD.Monster = TD.Displayable.extend({
  init: function(parent, textureSrc, path, speed){
    this._super(parent, textureSrc);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.path = path;
    this.pos = {
      x: path[0].x,
      y: path[0].y
    };
    this.speed = speed;

    var that = this;
    this.tween = TweenMax.to(this.pos, 10, {
      bezier: {'values': path},
      ease: 'Linear.easeNone',
      onComplete: function() {
        parent.removeChild(that.sprite);
        monsters.splice(monsters.indexOf(that), 1);
      }
    });
    this.tween.timeScale(speed);

  },
  updatePosition: function() {
    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;
  }
});

TD.Dragon = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/dragon/small.png', path, 0.7);
  }
});

TD.Wolf = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/wolf/small.png', path, 1.2);
  }
});

TD.Troll = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/troll/small.png', path, 0.6);
  }
});

TD.Swordman = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/swordman/small.png', path, 0.8);
  }
});

TD.Spider = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/spider/small.png', path, 1.0);
  }
});