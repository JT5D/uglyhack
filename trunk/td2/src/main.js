var TD = {
    pixiStage: null,
    monsters: [],
    bullets: []
};

TD.Displayable = Class.extend({
  init: function(parent, textureSrc, pos){
    this.parent = parent;
    var texture = PIXI.Texture.fromImage(textureSrc);
    this.sprite = new PIXI.Sprite(texture);
    if (pos) {
        this.sprite.position.x = pos.x;
        this.sprite.position.y = pos.y;
    }
    if (this instanceof TD.Monster) {
        parent.addChildAt(this.sprite, 0);
    } else {
        parent.addChild(this.sprite);
    }
  }
});

$(function() {
    var renderer = new PIXI.autoDetectRenderer(1000, 800);
    document.body.appendChild(renderer.view);
    renderer.view.style.width = window.innerWidth + "px";
    renderer.view.style.height = window.innerHeight + "px";
    
    TD.pixiStage = new PIXI.Stage;

    var map1 = new TD.Map1();
    
    setInterval(function() {
        
        
        if (Math.random() < 0.1) TD.monsters.push(new TD.Dragon(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.1) TD.monsters.push(new TD.Wolf(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.1) TD.monsters.push(new TD.Troll(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.1) TD.monsters.push(new TD.Swordman(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.1) TD.monsters.push(new TD.Spider(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.1) TD.monsters.push(new TD.OctoDragon(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.1) TD.monsters.push(new TD.Bat(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.1) TD.monsters.push(new TD.Bird(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.1) TD.monsters.push(new TD.IceTroll(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.1) TD.monsters.push(new TD.Rat(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.1) TD.monsters.push(new TD.Sheep(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        
    }, 500);

    requestAnimationFrame(animate);
    function animate() {

        renderer.render(TD.pixiStage);

        for(var i in TD.monsters) {
            TD.monsters[i].updatePosition();
        }

        for(var i in TD.bullets) {
            TD.bullets[i].updatePosition();
        }

        requestAnimationFrame(animate);
    }
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}