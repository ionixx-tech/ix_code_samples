import 'package:dvs_hybrid/component/tabbar/common/support/comment/list/comment_list_controller.dart';
import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:dvs_hybrid/model/supportCommentModel.dart';
import 'package:dvs_hybrid/model/supportModel.dart';
import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

class SupportCommentListPage extends StatefulWidget{

  static Navigate( BuildContext context,SupportModel supportModel){
    return  Navigator.of(context).push(new PageRouteBuilder(pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation){
      return new SupportCommentListPage(supportModel: supportModel,);
    },transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child){
      return FadeTransition(opacity: animation,child: child,);
    }));
  }

  SupportCommentListPage({@required this.supportModel});

  final SupportModel supportModel;

  @override
  _SupportCommentListState createState() => new _SupportCommentListState();
}

class _SupportCommentListState extends State<SupportCommentListPage>{

  List<SupportCommentModel> items = [];
    @override
    initState(){
      this._getSupport();
    }
  void _getSupport() async{
    CommentListController controller = new CommentListController();
    this.items = await controller.getSupportComments(context,widget.supportModel);
    setState((){});
  }
    Widget cellForIndex(BuildContext context,int idx){
      var  corssAxis = CrossAxisAlignment.start;
      if(idx%2==0){
        corssAxis = CrossAxisAlignment.end;
      }
      SupportCommentModel model = this.items[idx];
        return  new Container(
          margin: const EdgeInsets.only(left: 5.0,top: 5.0,right: 5.0),
            padding:const EdgeInsets.only(left: 5.0,right: 5.0,top: 5.0),
            child:  new Column(
              crossAxisAlignment: corssAxis,
              children: <Widget>[
                new Text(model.full_name,maxLines: 10, textAlign: TextAlign.left, style: new TextStyle(
                    fontWeight: FontWeight.w600
                ),),
                new Text(model.query),
                new Padding(padding: const EdgeInsets.only(bottom: 5.0,top:5.0),
                child: new Text(model.time_stamp),
                ),
                new Padding(padding: const EdgeInsets.only(bottom: 5.0)),
//                new Divider(height: 1.5,color: Colors.black12,)
              ],
            )
        );
    }
  @override
  Widget build(BuildContext context){
  
    return new Scaffold(
        appBar: new AppBar(title: new Text("Support Ticket")),
      body:  new Container(
        child: new ListView.builder(itemBuilder: cellForIndex,
          padding: new EdgeInsets.all(2.0),
          itemCount: this.items.length,
        ),
      )
    );
  }
}