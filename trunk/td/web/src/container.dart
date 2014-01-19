part of towerdefense;

class TdContainer extends DisplayObjectContainer {
  
  Bitmap spider;
  
  TdContainer() {
    
    var bitmapData = resourceManager.getBitmapData('spider');
    spider = new Bitmap(bitmapData);
    addChild(spider);
    
    animateForth();
  }
  
  void animateForth() {
    Tween tween = new Tween(spider, 2.0, TransitionFunction.easeInOutQuintic);
    tween.animate.x.by(600);
    tween.animate.y.by(400);
    tween.onComplete  = () {
      animateBack();
    };
    juggler.add(tween);
  }
  
  void animateBack() {
    Tween tween = new Tween(spider, 2.0, TransitionFunction.easeInOutQuintic);
    tween.animate.x.by(-600);
    tween.animate.y.by(-400);
    tween.onComplete  = () {
      animateForth();
    };
    juggler.add(tween);
  }
  
}

