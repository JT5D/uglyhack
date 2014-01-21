var TD = {};

TD.Displayable = Class.extend({
  init: function(parent, textureSrc, pos){
    var texture = PIXI.Texture.fromImage(textureSrc);
    this.sprite = new PIXI.Sprite(texture);
    if (pos) {
        this.sprite.position.x = pos.x;
        this.sprite.position.y = pos.y;
    }
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
        setTimeout(function() { monsters.push(new TD.Dragon(map1.sprite, map1.paths[0])); }, Math.random() * 1000);
        setTimeout(function() { monsters.push(new TD.Wolf(map1.sprite, map1.paths[1])); }, Math.random() * 1000);
        setTimeout(function() { monsters.push(new TD.Troll(map1.sprite, map1.paths[0])); }, Math.random() * 1000);
        setTimeout(function() { monsters.push(new TD.Swordman(map1.sprite, map1.paths[1])); }, Math.random() * 1000);
        setTimeout(function() { monsters.push(new TD.Spider(map1.sprite, map1.paths[0])); }, Math.random() * 1000);
        setTimeout(function() { monsters.push(new TD.OctoDragon(map1.sprite, map1.paths[0])); }, Math.random() * 1000);
        
    }, 3000);

    requestAnimationFrame(animate);
    function animate() {

        renderer.render(pixiStage);

        for(var i in monsters) {
            monsters[i].updatePosition();
        }

        requestAnimationFrame(animate);
    }
});