import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:flutter/material.dart';


typedef OnPressCallback = void Function(CardItemWidget title);

class CardItemWidget extends StatelessWidget{
  CardItemWidget({Key key,this.title,this.image,this.onPress,this.tag}): super(key:key);
  final String title;
  final String image ;
  final OnPressCallback onPress;
  final int tag;
  _onPressClicked(){
    onPress(this);
  }
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return  new Card(
      child: new FlatButton(
          onPressed: _onPressClicked,
          padding: const EdgeInsets.all(10.0),
          child: new Row(

            children: <Widget>[
              new ImageView(this.image,
                width:30.0,
                height:30.0,
                tintColor: AppTheme.secondary,
              ),
              new Container(
                margin: const EdgeInsets.only(left: 10.0),
                child: new Text(this.title,
                  style: new TextStyle(
                    fontWeight: FontWeight.w600
                  ),
                ),
              )
            ],
          )
      ),
    );
  }

}
