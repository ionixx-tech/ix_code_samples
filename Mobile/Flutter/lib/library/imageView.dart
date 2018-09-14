import 'package:flutter/material.dart';

class ImageView extends Container{
  ImageView(this.path,{Key key,this.fit:BoxFit.fill,this.width,this.height,this.tintColor,this.margin}): super(key:key);
  final String path;
  final BoxFit fit;
  final double width;
  final double height;
  final Color tintColor;
  final EdgeInsets margin;
  @override
  Widget build(BuildContext context){
    ColorFilter filter;
    if(this.tintColor != null){
      filter = new ColorFilter.mode(tintColor,BlendMode. srcIn);
    }
    return new Container( 
      width: width,
      height:height,
      margin: this.padding,
      decoration: new BoxDecoration(
        image: new DecorationImage(
          colorFilter: filter,
          image: new AssetImage(this.path),
          fit: fit
        )
      ),
    );
  }
}