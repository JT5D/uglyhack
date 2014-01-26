TD.Monster = TD.Displayable.extend({
  init: function(parent, textureSrc, path, speed){
    var _pos = {
      x: path.path[0].x,
      y: path.path[0].y
    }

    this.pos = _pos;
    this._super(parent, textureSrc, _pos);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1.0;
    this.sprite.pivot.x = 0.5;
    this.sprite.pivot.y = 1.0;

    var that = this;
    this.path = path;
    this.speed = speed;
    this.alive = true;
    this.dying = false;

    // Move
    
    this.tween = TweenMax.to(this.pos, path.len / 80, {
      bezier: {'values': path.path},
      ease: 'Linear.easeNone',
      onComplete: function() {
        that.alive = false;
      }
    });
    this.tween.timeScale(speed);

    // Wiggle
    this.sprite.rotation = 0.1;
    var rotateFnc = function() {
      TweenMax.to(that.sprite, (1/that.speed)/3, {
        rotation: -that.sprite.rotation,
        onComplete: function() {
          rotateFnc();
        }
      })
    }
    rotateFnc();

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
    this._super(parent, 'img/monsters/dragon/small.png', path, 0.71);
  }
});

TD.OctoDragon = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/octodragon/small.png', path, 1.02);
  }
});

TD.Wolf = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/wolf/small.png', path, 1.33);
  }
});

TD.Troll = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/troll/small.png', path, 0.64);
  }
});

TD.Swordman = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/swordman/small.png', path, 0.75);
  }
});

TD.Spider = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/spider/small.png', path, 1.06);
  }
});

TD.Bat = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/bat/small.png', path, 0.87);
  }
});

TD.Bird = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/bird/small.png', path, 0.68);
  }
});

TD.IceTroll = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/icetroll/small.png', path, 0.59);
  }
});

TD.Rat = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/rat/small.png', path, 0.86);
  }
});

TD.Sheep = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/sheep/small.png', path, 0.61);
  }
});

TD.Fireman = TD.Monster.extend({
  init: function(parent, path) {
    this._super(parent, 'img/monsters/fireman/small.png', path, 0.82);
  }
});