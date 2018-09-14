import 'package:dvs_hybrid/component/tabbar/bsp/profile/profile.dart';
import 'package:dvs_hybrid/component/tabbar/tsp/bsp/list/bspListController.dart';
import 'package:dvs_hybrid/component/tabbar/tsp/bsp/profile/profile.dart';
import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:dvs_hybrid/model/bspModel.dart';
import 'package:dvs_hybrid/confic/route.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/storage/usermanager.dart';
import 'package:flutter/material.dart';

class BSPListPage extends StatefulWidget{
  @override
    _BSPListState createState() => new _BSPListState();
}

class _BSPListState extends State<BSPListPage>{

  List<BSPModel> items = [];
  @override
  initState(){
//      scheduleMicrotask(this.getUserList());
    this.getUserList();
  }
  void getUserList() async{
    BSPListController controller = new BSPListController();
    this.items = await controller.userlist(context);
    setState((){});
  }
  didSelectIndex(int idx){
    BSPProfilePage.Navigate(context, items[idx]);
  }
  Widget cellForIndex(BuildContext context,int idx){
    BSPModel model = this.items[idx];
    return  new Container(
        padding:const EdgeInsets.only(left: 5.0,right: 5.0,top: 5.0),
        child: new Card(
          child: new FlatButton(
            padding: const EdgeInsets.all(0.0),
            onPressed: (){this.didSelectIndex(idx);},
            child: new Row(
              textBaseline: TextBaseline.alphabetic,
              children: <Widget>[
                new Container(
                  margin: const EdgeInsets.all(5.0),
                  child: new CircleAvatar(backgroundColor: AppTheme.secondary, child: new Text(model.tag,style: new TextStyle(color: Colors.white),)),
                ),
                new Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    new Text(model.organization_name, textAlign: TextAlign.left, style: new TextStyle(
                        fontWeight: FontWeight.w600
                    ),),
                    new Text(model.full_name, textAlign: TextAlign.left,),
                  ],
                )
              ],

            ),
          )
        )
    );
  }
  @override
  Widget build(BuildContext context){
  
    return new Scaffold(
        appBar: new AppBar(title: new Text("BSP Users")),
      body:  new Container(
        child: new ListView.builder(itemBuilder: cellForIndex,
          padding: new EdgeInsets.all(2.0),
          itemCount: this.items.length,
        ),
      )
    );
  }
}