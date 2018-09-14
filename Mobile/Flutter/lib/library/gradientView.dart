import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

class GradientView extends StatelessWidget{
  GradientView({Key key,@required this.child,@required this.colors,this.tileMode:TileMode.clamp,this.margin,this.padding}): super(key:key);
  final TileMode tileMode;
  final List<Color> colors;
  final Widget child;
  final EdgeInsets margin;
  final EdgeInsets padding;
  @override
  Widget build(BuildContext context){

    return new Container(child: new Container(
      child: this.child,
      margin: this.margin,
      padding: this.padding,
      decoration: new BoxDecoration(
        gradient: new LinearGradient(
            colors: this.colors,
            begin: const FractionalOffset(0.0, 0.0),
            end: const FractionalOffset(1.0, 0.0),
            stops: [0.0, 1.0],
            tileMode: TileMode.clamp ),
      ),
    ));
  }
}