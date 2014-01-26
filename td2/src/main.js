var TD = {
    pixiStage: null,
    renderer: null,
    monsters: [],
    bullets: [],
    towers: []
};

TD.Displayable = Class.extend({
  init: function(parent, textureSrc, pos){
    this.parent = parent;

    if (textureSrc) {
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage(textureSrc));
    } else {
        this.sprite = new PIXI.DisplayObjectContainer();
    }
    

    if (pos) {
        this.sprite.position.x = pos.x;
        this.sprite.position.y = pos.y;
    }
    parent.addChild(this.sprite);
  }
});



$(function() {
    TD.renderer = new PIXI.autoDetectRenderer(1000, 735);
    document.body.appendChild(TD.renderer.view);
    scaleRenderer();

    $(window).resize(scaleRenderer);
    
    TD.pixiStage = new PIXI.Stage;

    var map1 = new TD.Map2();
    
    setInterval(function() {
        
        
        if (Math.random() < 0.08) TD.monsters.push(new TD.Dragon(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.Wolf(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.Troll(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.Swordman(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.Spider(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.OctoDragon(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.Bat(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.Bird(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.IceTroll(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.Rat(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.Sheep(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        if (Math.random() < 0.08) TD.monsters.push(new TD.Fireman(map1.sprite, map1.paths[getRandomInt(0, map1.paths.length-1)]));
        
    }, 1000);

    requestAnimationFrame(animate);
    function animate() {

                

        for(var i in TD.monsters) {
            var m = TD.monsters[i];
            if (m.alive === false) {
                m.parent.removeChild(m.sprite);
                TD.monsters.splice(TD.monsters.indexOf(m), 1);    
            } else {
                m.updatePosition();
            }
        }

        for(var i in TD.bullets) {
            var b = TD.bullets[i];
            if (b.alive === false) {
                b.parent.removeChild(b.sprite);
                TD.bullets.splice(TD.bullets.indexOf(b), 1);    
            } else {
                b.updatePosition();
            }
        }

        for(var i in TD.towers) {
            TD.towers[i].tryshoot();
        }

        map1.zIndex()
        
        TD.renderer.render(TD.pixiStage);
        requestAnimationFrame(animate);
    }
});

function scaleRenderer() {
    TD.renderer.view.style.width = window.innerWidth + "px";
    TD.renderer.view.style.height = window.innerHeight + "px";
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function distance(pos1, pos2) {
        var dx = pos1.x-pos2.x;
        var dy = pos1.y-pos2.y;
        var d = Math.sqrt(dx*dx + dy*dy);

        return {d:d, dy:dy, dx:dx};
}