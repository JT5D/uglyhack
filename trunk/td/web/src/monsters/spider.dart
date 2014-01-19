part of towerdefense;

class Spider extends Monster {
  
  Spider(JsObject pathGrid, int gridX, int gridY) : super('spider', 35, 25, pathGrid, gridX, gridY) {
    setSpeed(13.0);
  }
  
}