library FlutterLoadingIndicator;
import 'package:flutter/material.dart';

/*
  BasicAlertView :
*/
class LoadingIndicator{
  BuildContext context;
  bool barrierDismissible=false;
  String text;
  bool _isLoading=false;
  LoadingIndicator({this.context,this.barrierDismissible=true});

  void dismiss(){
    this._isLoading = false;
    Navigator.of(context).pop();
  }
  void show(){
    if (this._isLoading){
      return;
    }
    this._isLoading = false;
    var titleText = null;
    if (this.text !=null){
      titleText = new Text(this.text, textAlign: TextAlign.center);
    }
    showDialog<Null>(
      context: context,
      barrierDismissible: this.barrierDismissible, // user must tap button!
      builder: (BuildContext context) {
        return new AlertDialog(
          title: titleText,
          content: new Container(
            width: 60.0,
            height: 40.0,
            child: new Center(
              child: new CircularProgressIndicator(
              ),
            ),
          )
        );
      },
    );
  }
}