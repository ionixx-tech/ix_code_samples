import 'package:dvs_hybrid/component/tabbar/bsp/profile/profileController.dart';
import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:dvs_hybrid/model/bspModel.dart';
import 'package:flutter/material.dart';

class BSPProfile extends StatefulWidget{
  BSPProfile({this.idx});
  final int idx;
  @override
  _BSPProfilePageState createState() => new _BSPProfilePageState();
}

class _BSPProfilePageState extends State<BSPProfile>{

  List<BSPModel> items = [];
  @override
  initState(){
    this.getUserList();
  }
  void getUserList() async{
    print(this.widget.idx);
//    BSPListController controller = new BSPListController();
//    this.items = await controller.userlist(context);
//    setState((){});
  }

  @override
  Widget build(BuildContext context){
  
    return new Scaffold(
        appBar: new AppBar(title: new Text("BSP Profile")),
      body:  new Container(
        child: new Text("00")

      )
    );
  }
}