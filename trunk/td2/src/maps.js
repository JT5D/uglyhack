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
        {'x': -75, 'y': 123}, {'x': 121, 'y': 214}, {'x': 399, 'y': 257},
        {'x': 388, 'y': 437}, {'x': 273, 'y': 663}, {'x': 391, 'y': 850}
      ]},
      {path: [
        {'x': -75, 'y': 146}, {'x': 158, 'y': 176}, {'x': 380, 'y': 284},
        {'x': 462, 'y': 461}, {'x': 686, 'y': 523}, {'x': 853, 'y': 850}
      ]}
    ]);

    new TD.Tower1(this.sprite, {x: 260, y: 250});
    new TD.Tower1(this.sprite, {x: 500, y: 520});
    new TD.Tower1(this.sprite, {x: 570, y: 300});
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