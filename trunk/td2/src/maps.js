TD.Map = TD.Displayable.extend({
  init: function(textureSrc, paths){
    this._super(TD.pixiStage, textureSrc);
    this.paths = paths;
  }
});

TD.Map1 = TD.Map.extend({
  init: function(){
    this._super('img/maps/map1.jpg', [
      [
        {'x': -75, 'y': 123}, {'x': 121, 'y': 214}, {'x': 399, 'y': 257},
        {'x': 388, 'y': 437}, {'x': 273, 'y': 663}, {'x': 391, 'y': 850}
      ],
      [
        {'x': -75, 'y': 146}, {'x': 158, 'y': 176}, {'x': 380, 'y': 284},
        {'x': 462, 'y': 461}, {'x': 686, 'y': 523}, {'x': 853, 'y': 850}
      ]
    ]);

    new TD.Tower1(this.sprite, {x: 260, y: 250});
    new TD.Tower1(this.sprite, {x: 500, y: 520});
    new TD.Tower1(this.sprite, {x: 570, y: 300});
  }
});