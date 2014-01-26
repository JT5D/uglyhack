TD.Map = TD.Displayable.extend({
  init: function(textureSrc, paths){
    this._super(TD.pixiStage, textureSrc);
    this.paths = paths;

    for (var i in this.paths) {

      var len = 0;
      for (var j = 0; j < this.paths[i].path.length - 1; j++) {
        len += distance(this.paths[i].path[j], this.paths[i].path[j+1]).d;
      }
      this.paths[i].len = len;
    }
  },
  zIndex: function() {

    this.sprite.children.sort(function(a,b){
      return a.position.y-b.position.y;
    });
  }
});

TD.Map1 = TD.Map.extend({
  init: function(){
    this._super('img/maps/1.jpg', [
      {path: [
        {'x': 158, 'y': -50}, {'x': 221, 'y': 172}, {'x': 231, 'y': 351},
        {'x': 155, 'y': 486}, {'x': 280, 'y': 576}, {'x': 425, 'y': 500},
        {'x': 510, 'y': 324}, {'x': 649, 'y': 324}, {'x': 739, 'y': 451},
        {'x': 875, 'y': 614}, {'x': 1050, 'y': 630}
      ]},
      {path: [
        {'x': 212, 'y': -50}, {'x': 270, 'y': 168}, {'x': 263, 'y': 364},
        {'x': 199, 'y': 477}, {'x': 288, 'y': 538}, {'x': 410, 'y': 467},
        {'x': 509, 'y': 285}, {'x': 658, 'y': 290}, {'x': 805, 'y': 300},
        {'x': 1050, 'y': 157}
      ]}
    ]);

    new TD.Tower1(this.sprite, {x: 290, y: 470});
    new TD.Tower1(this.sprite, {x: 580, y: 420});
    new TD.Tower1(this.sprite, {x: 810, y: 400});
  }
});

TD.Map2 = TD.Map.extend({
  init: function(){
    this._super('img/maps/2.jpg', [
      {path: [
        {'x': 515, 'y': -50}, {'x': 495, 'y': 270}, {'x': 320, 'y': 322},
        {'x': 187, 'y': 240}, {'x': 112, 'y': 376}, {'x': 178, 'y': 531},
        {'x': 398, 'y': 606}, {'x': 663, 'y': 558}, {'x': 864, 'y': 626},
        {'x': 897, 'y': 785}
      ]},
      {path: [
        {'x': 546, 'y': -50}, {'x': 545, 'y': 130}, {'x': 663, 'y': 215},
        {'x': 819, 'y': 277}, {'x': 828, 'y': 421}, {'x': 701, 'y': 525},
        {'x': 740, 'y': 576}, {'x': 855, 'y': 652}, {'x': 909, 'y': 785}
      ]}
    ]);

    new TD.Tower1(this.sprite, {x: 185, y: 320});
    new TD.Tower1(this.sprite, {x: 820, y: 540});
    new TD.Tower1(this.sprite, {x: 610, y: 280});
  }
});