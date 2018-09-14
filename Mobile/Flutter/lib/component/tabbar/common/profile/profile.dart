import 'package:dvs_hybrid/component/widget/profileItemWidget.dart';
import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:dvs_hybrid/model/userModel.dart';
import 'package:dvs_hybrid/model/bspModel.dart';
import 'package:flutter/material.dart';

class ProfilePage extends StatefulWidget{

  static Navigate( BuildContext context,UserModel userModel){
    return  Navigator.of(context).push(new PageRouteBuilder(pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation){
      return new ProfilePage(userModel: userModel,);
    },transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child){
      return FadeTransition(opacity: animation,child: child,);
    }));
  }


  ProfilePage({this.userModel});
final UserModel userModel;
  @override
  _ProfilePageState createState() => new _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage>  {


  @override
  initState(){

  }

  @override
  Widget build(BuildContext context){
    var size = MediaQuery.of(context).size;
    var userModel = widget.userModel;
    return new Scaffold(
      appBar: new AppBar(title: new Text("My Profile")),
      body:  new ListView(

        children: <Widget>[
          new Container(
            child: new ImageView(AssetImageName.header_background, width: size.width-10.0,height: size.width/1.5,),
          ),
          new ProfileItemWidget( sectionModel: new SectionModel(title: "Name",details: userModel.full_name)),
          new ProfileItemWidget( sectionModel: new SectionModel(title: "Username",details: userModel.username)),
          new ProfileItemWidget( sectionModel: new SectionModel(title: "Email",details: userModel.email)),
          new ProfileItemWidget( sectionModel: new SectionModel(title: "Role",details: userModel.user_role.toUpperCase())),
        ],
      ),
    );
  }
}