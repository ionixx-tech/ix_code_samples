import 'package:dvs_hybrid/component/tabbar/common/profile/profile.dart';
import 'package:dvs_hybrid/component/tabbar/common/userlist/grade_userlist_controller.dart';
import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:dvs_hybrid/model/bspModel.dart';
import 'package:dvs_hybrid/model/userModel.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/storage/usermanager.dart';
import 'package:flutter/material.dart';

class GradeUserListPage extends StatefulWidget{
  @override
    _GradeUserListState createState() => new _GradeUserListState();
}

class _GradeUserListState extends State<GradeUserListPage>{

  List<UserModel> items = [];
    @override
    initState(){
      this.getUserList();
    }
    void getUserList() async{
      GradeUserListController controller = new GradeUserListController();
      this.items = await controller.userlist(context);
      setState((){});
    }
    void didSelectedIndex(int idx){
      ProfilePage.Navigate(context, items[idx]);
    }
    Widget cellForIndex(BuildContext context,int idx){
      UserModel model = this.items[idx];
        return new Container(
            padding:const EdgeInsets.only(left: 5.0,right: 5.0,top: 5.0),
            child: new Card(
            child: new FlatButton(onPressed: (){ this.didSelectedIndex(idx); },
                padding: const EdgeInsets.all(0.0),

                child: new Row(
                  textBaseline: TextBaseline.alphabetic,
                  children: <Widget>[
                    new Container(
                      margin: const EdgeInsets.all(5.0),
                      child: new CircleAvatar(backgroundColor: model.colors(), child: new Text(model.tag,style: new TextStyle(color: Colors.white),)),
                    ),
                    new Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        new Text(model.full_name, textAlign: TextAlign.left, style: new TextStyle(
                            fontWeight: FontWeight.w600
                        ),),
                        new Text(model.user_role, textAlign: TextAlign.left,),
                      ],
                    )
                  ],
            )
            ),
          )
        );
    }
  @override
  Widget build(BuildContext context){
    return new Scaffold(
        appBar: new AppBar(title: new Text("Grade Users")),
      body:  new Container(
        child: new ListView.builder(itemBuilder: cellForIndex,
          padding: new EdgeInsets.all(2.0),
          itemCount: this.items.length,
        ),
      )
    );
  }
}