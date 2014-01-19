library towerdefense;

import 'dart:html';
import 'package:stagexl/stagexl.dart';

part 'src/container.dart';

Stage stage;
RenderLoop renderLoop;
Juggler juggler;
ResourceManager resourceManager;

void main() {

  // initialize Stage and RenderLoop
  stage = new Stage('stage', querySelector('#stage'));
  renderLoop = new RenderLoop();
  renderLoop.addStage(stage);
  juggler = renderLoop.juggler;

  // initialize ResourceManager
  resourceManager = new ResourceManager()
    ..addBitmapData('spider', 'img/spider-small.jpg');

  resourceManager.load()
    .then((_) => stage.addChild(new TdContainer()))
    .catchError((e) => print(e));
}