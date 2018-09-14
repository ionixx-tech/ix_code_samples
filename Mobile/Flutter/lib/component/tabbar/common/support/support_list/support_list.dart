import 'package:dvs_hybrid/component/tabbar/common/support/comment/list/comment_list.dart';
import 'package:dvs_hybrid/component/tabbar/common/support/support_list/support_controller.dart';
import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:dvs_hybrid/model/supportCommentModel.dart';
import 'package:dvs_hybrid/model/supportModel.dart';
import 'package:flutter/material.dart';

class SupportListPage extends StatefulWidget{
  @override
    _SupportListState createState() => new _SupportListState();
}

class _SupportListState extends State<SupportListPage>{

  List<SupportModel> items = [];
    @override
    initState(){
      this._getSupport();
    }
    void _getSupport() async{
      SupportListController controller = new SupportListController();
      this.items = await controller.getSupportTicket(context);
      setState((){});
    }
    didSelectIndex(int idx){
      SupportCommentListPage.Navigate(context, items[idx]);
    }
    Widget cellForIndex(BuildContext context,int idx){
      SupportModel model = this.items[idx];
        return  new Container(
            padding:const EdgeInsets.only(left: 5.0,right: 5.0,top: 5.0),
//            constraints: new BoxConstraints.expand(),
            child: new Card(
              child: new FlatButton(onPressed: (){this.didSelectIndex(idx);},
                  padding: const EdgeInsets.all(0.0),
                  child: new Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: <Widget>[
                      new Container(
                        margin: const EdgeInsets.all(5.0),
                        child: new CircleAvatar(backgroundColor: model.color, child: new Text(model.tag,style:  new TextStyle(
                            color: Colors.white
                        ),),),
                      ),
                      new Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        verticalDirection: VerticalDirection.down,
                        textBaseline: TextBaseline.alphabetic,

                        children: <Widget>[
                          new Text(model.title,maxLines: 10, textAlign: TextAlign.left, style: new TextStyle(
                              fontWeight: FontWeight.w600
                          ),),
                          new Text(model.query,  overflow: TextOverflow.fade, softWrap: false, maxLines: 3,

                          ),
                        ],
                      )
                    ],
                  )),
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