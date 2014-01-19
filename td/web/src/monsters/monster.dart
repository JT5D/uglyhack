part of towerdefense;

class Monster extends Bitmap {
  
  JsObject pathGrid; 
  int gridX;
  int gridY;
  
  List monsters;
  
  int bitmapOffX;
  int bitmapOffY;
  
  var speed = 1.0;
  
  Monster(String bitmapStr, int bitmapOffX, int bitmapOffY, JsObject pathGrid, int gridX, int gridY) : 
    super(resourceManager.getBitmapData(bitmapStr)) {
    
    
    GlowFilter filter = new GlowFilter(Color.Black, 1.0, 10, 10);
    var filterBounds = filter.getBounds();
    filterBounds.inflate(bitmapData.width, bitmapData.height);
    filters = [filter];
    applyCache(filterBounds.left, filterBounds.top, filterBounds.width, filterBounds.height);
    
    this.bitmapOffX = bitmapOffX;
    this.bitmapOffY = bitmapOffY;
    
    this.pathGrid = pathGrid;
    this.gridX = gridX;
    this.gridY = gridY;
    
    
    x = gridXToX(gridX);
    y = gridXToX(gridY);
    
  }
  
  void setSpeed(var newSpeed) { speed = newSpeed; }
  
  void setMonsters(List monsters) {
    this.monsters = monsters;
  }
  
  void moveToGoal(int goalX, int goalY, Function goalReached) {
    
    if (gridX == goalX && gridY == goalY) {
      goalReached(this);
      return;
    }
    
    JsObject finder = new JsObject(context['PF']['AStarFinder']);
    finder['allowDiagonal'] = true;
    finder['dontCrossCorners'] = true;
    
    JsObject clonedPathGrid = pathGrid.callMethod('clone');
    
    for (Monster m in monsters) {
      if (m.gridX != gridX || m.gridY != gridY) {
        clonedPathGrid.callMethod('setWalkableAt', [m.gridX, m.gridY, false]);
      }
    }
    
    JsObject path = finder.callMethod('findPath', [gridX, gridY, goalX, goalY, clonedPathGrid]);
    
    if (path['length'] > 0) {
      var nextX = path[1][0];
      var nextY = path[1][1];
      
      var tween = new Tween(this, 1 / speed, TransitionFunction.linear);
      tween.animate.x.to(gridXToX(nextX));
      tween.animate.y.to(gridXToX(nextY));
      tween.onComplete = () {
        gridX = nextX;
        gridY = nextY;
        moveToGoal(goalX, goalY, goalReached);
      };
      juggler.add(tween);
      
    } else {
      new Timer(new Duration(seconds: 1), () {
        moveToGoal(goalX, goalY, goalReached);
      });
    }
    
  }
  
  int gridXToX(int gx) {
    return gx * 20 + 10 - bitmapOffX;
  }
  
  int gridYToY(int gy) {
    return gy * 20 + 10 - bitmapOffY;
  }
  
}