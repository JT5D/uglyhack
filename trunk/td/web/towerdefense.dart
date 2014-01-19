library towerdefense;

import 'dart:html';
import 'dart:js';
import 'dart:async';
import 'dart:math';
import 'package:stagexl/stagexl.dart';

part 'src/map.dart';
part 'src/monsters/monster.dart';
part 'src/monsters/spider.dart';

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
    ..addBitmapData('spider', 'img/monsters/spider/spider-small.png');

  resourceManager.load()
    .then((_) => stage.addChild(new Map()))
    .catchError((e) => print(e));
}