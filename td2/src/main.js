var TD = {};

TD.Displayable = Class.extend({
  init: function(parent, textureSrc){
    var texture = PIXI.Texture.fromImage(textureSrc);
    this.sprite = new PIXI.Sprite(texture);
    parent.addChild(this.sprite);
  }
});

var pixiStage;
var monsters = [];

$(function() {
    var renderer = new PIXI.WebGLRenderer(1000, 800);
    document.body.appendChild(renderer.view);
    pixiStage = new PIXI.Stage;

    var map1 = new TD.Map1();
    
    setInterval(function() {
        monsters.push(new TD.Dragon(map1.sprite, map1.paths[0]));
        monsters.push(new TD.Wolf(map1.sprite, map1.paths[1]));
        monsters.push(new TD.Troll(map1.sprite, map1.paths[0]));
        monsters.push(new TD.Swordman(map1.sprite, map1.paths[1]));
        monsters.push(new TD.Spider(map1.sprite, map1.paths[0]));
    }, 2000);

    requestAnimationFrame(animate);
    function animate() {

        renderer.render(pixiStage);

        for(var i in monsters) {
            monsters[i].updatePosition();
        }

        requestAnimationFrame(animate);
    }
});