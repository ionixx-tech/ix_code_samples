library FlutterAlertView;
import 'package:flutter/material.dart';


typedef OnPressCallback = void Function(AlertViewAction action);

abstract class AbstractAlertView{
  List<AlertViewAction> actions=[];
  BuildContext context;
  final String title;
  final String message;
  bool barrierDismissible; // user must tap button!

  AbstractAlertView(BuildContext context,{this.title,this.message,this.barrierDismissible:false }) {this.context=context;}
  void addAlertViewAction(AlertViewAction item){
    this.actions.add(item);
  }
  void show(){assert(actions.length!=0);}
}

class AlertViewAction{

  String title;
  Color titleColor;
  OnPressCallback callback;
  AlertViewAction({this.title,this.callback,this.titleColor:Colors.black}){}
}

/*
  SimpleAlertView : simple alert with option buttons
*/
class AdvanceAlertView extends AbstractAlertView{
  AdvanceAlertView(BuildContext context,String title,String message) : super(context,title:title,message:message);
  SimpleDialogOption _mapActionButton(int idx){
    AlertViewAction action = this.actions[idx];
    return  new SimpleDialogOption(
        onPressed: () { Navigator.of(context).pop(); action.callback(action); },
        child: new Text(action.title,textAlign: TextAlign.center, style: new TextStyle(
          color: action.titleColor
        ),),
      );
   }
  void show(){
    super.show();
    showDialog(
      context: context,
      barrierDismissible: this.barrierDismissible, // user must tap button!
      builder: (BuildContext context)=> new SimpleDialog(
        title: new Text(this.title, textAlign: TextAlign.center,),
        children: new List<Widget>.generate(this.actions.length, _mapActionButton)
      ),
    );
  }
}

/*
  BasicAlertView :
*/
class BasicAlertView extends AbstractAlertView{
  BasicAlertView(BuildContext context,String title,String message) : super(context,title:title,message:message);

  FlatButton _mapActionButton(int idx){
    AlertViewAction action = this.actions[idx];
    return new FlatButton(
      child: new Text(action.title, style: new TextStyle(
          color: action.titleColor
      ),),
      onPressed:  () { Navigator.of(context).pop(); action.callback(action); },
    );
  }
  void show(){
    super.show();
    showDialog<Null>(
      context: context,
      barrierDismissible: this.barrierDismissible, // user must tap button!
      builder: (BuildContext context) {
        return new AlertDialog(
          title: new Text(this.title, style: new TextStyle(
              fontWeight: FontWeight.w600
          ),),
          content: new SingleChildScrollView(
            child: new ListBody(
              children: <Widget>[
                new Text(this.message, style: new TextStyle(
                  fontWeight: FontWeight.w600
                ),),
              ],
            ),
          ),
          actions: new List<FlatButton>.generate(this.actions.length, _mapActionButton)
        );
      },
    );
  }
}