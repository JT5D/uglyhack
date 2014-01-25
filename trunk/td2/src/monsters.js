TD.Monster = TD.Displayable.extend({
  init: function(parent, textureSrc, path, speed){
    var _pos = {
      x: path[0].x,
      y: path[0].y
    }

    this.pos = _pos;
    this._super(parent, textureSrc, _pos);

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    
    this.path = path;
    this.speed = speed;
    this.alive = true;
    this.dying = false;

    var that = this;
    this.tween = TweenMax.to(this.pos, 10, {
      bezier: {'values': path},
      ease: 'Linear.easeNone',
      onComplete: function() {
        that.alive = false;
      }
    });
    this.tween.timeScale(speed);

  },
  updatePosition: function() {
    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;
  },
  hit: function(bullet) {
    
    this.tween.kill();
    this.dying = true;

    var that = this;
    TweenMax.to(this.sprite.scale, 1, {x: 0, y: 0, onComplete: function() {
      that.alive = false; 
    }});
  }
});

TD.Dragon = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/dragon/small.png', path, 0.7);
  }
});

TD.OctoDragon = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/octodragon/small.png', path, 1.0);
  }
});

TD.Wolf = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/wolf/small.png', path, 1.3);
  }
});

TD.Troll = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/troll/small.png', path, 0.6);
  }
});

TD.Swordman = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/swordman/small.png', path, 0.75);
  }
});

TD.Spider = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/spider/small.png', path, 1.0);
  }
});

TD.Bat = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/bat/small.png', path, 0.8);
  }
});

TD.Bird = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/bird/small.png', path, 0.6);
  }
});

TD.IceTroll = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/icetroll/small.png', path, 0.5);
  }
});

TD.Rat = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/rat/small.png', path, 0.85);
  }
});

TD.Sheep = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/sheep/small.png', path, 0.65);
  }
});