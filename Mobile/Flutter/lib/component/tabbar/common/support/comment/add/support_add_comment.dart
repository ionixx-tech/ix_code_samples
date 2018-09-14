import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:dvs_hybrid/model/bspModel.dart';
import 'package:dvs_hybrid/model/supportModel.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/storage/usermanager.dart';
import 'package:flutter/material.dart';

class SupportListPage extends StatefulWidget{
  @override
    _SupportListState createState() => new _SupportListState();
}

class _SupportListState extends State<SupportListPage>{

  List<SupportModel> items = [];
    @override
    initState(){
    }

    Widget cellForIndex(BuildContext context,int idx){
      SupportModel model = this.items[idx];
        return  new Container(
            padding:const EdgeInsets.only(left: 5.0,right: 5.0,top: 5.0),
            child: new Card(
              child: new Row(
                children: <Widget>[
                  new Container(
                    margin: const EdgeInsets.all(5.0),
                    child: new ImageView(AssetImageName.profile, width: 50.0,height: 50.0),
                  ),
                  new Column(
                    children: <Widget>[
                      new Text(model.title,maxLines: 10, textAlign: TextAlign.left, style: new TextStyle(
                          fontWeight: FontWeight.w600
                      ),),
                      new Text(model.query),
                    ],
                  )
                ],
              ),
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