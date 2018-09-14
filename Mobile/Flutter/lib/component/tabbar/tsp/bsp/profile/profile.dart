import 'package:dvs_hybrid/component/widget/profileItemWidget.dart';
import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:dvs_hybrid/model/bspModel.dart';
import 'package:dvs_hybrid/model/userModel.dart';
import 'package:dvs_hybrid/storage/usermanager.dart';
import 'package:flutter/material.dart';

class BSPProfilePage extends StatefulWidget{

  static Navigate( BuildContext context,BSPModel userModel){
    return  Navigator.of(context).push(new PageRouteBuilder(pageBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation){
      return new BSPProfilePage(userModel: userModel,);
    },transitionsBuilder: (BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child){
      return FadeTransition(opacity: animation,child: child,);
    }));
  }
  BSPProfilePage({this.userModel});
  final BSPModel userModel;

  @override
  _BSPProfileState createState() => new _BSPProfileState();
}

class _BSPProfileState extends State<BSPProfilePage>{

  @override
  initState(){
  }

  Widget _section(String title,List<SectionModel>models){
    return new Card(
        child: new Column(
          crossAxisAlignment: CrossAxisAlignment.start,
            children: [
            new Container(
              child: new Text(title, textAlign: TextAlign.left, style: new TextStyle(
                fontWeight: FontWeight.bold,
                color: AppTheme.secondary
              ),
              ),
              margin: const EdgeInsets.only(left: 5.0,top: 5.0),
            ),
            new Column(
              children: new List.generate(models.length, (int idx){
                var section = models[idx];
                return  new ProfileItemWidget(sectionModel: section,);
              }),
            )
          ]
        )
    );
  }
  @override
  Widget build(BuildContext context){
    var userModel = widget.userModel;
    var size = MediaQuery.of(context).size;
    return new Scaffold(
        appBar: new AppBar(title: new Text( userModel.full_name +"'s Profile")),
          body:  new ListView(
          children: <Widget>[
            new Container(
              child: new ImageView(AssetImageName.header_bsp_background, width: size.width-10.0,height: size.width/1.75,),
            ),
             new Padding(padding: const EdgeInsets.only(top: 5.0)),
             _section("Basic Profile", [
               new SectionModel(title: "Name",details:userModel.full_name ),
               new SectionModel(title: "PhoneNumber",details:userModel.phone_number )
             ]),
            _section("Organization", [
               new SectionModel(title: "Organization",details:userModel.organization_name ),
               new SectionModel(title: "PhoneNumber",details:userModel.organization_id ),
               new SectionModel(title: "Address",details:userModel.address )
             ]),
            _section("Token", [
                         new SectionModel(title: "Name",details:userModel.token_name ?? "N/A" ),
                         new SectionModel(title: "Symbol",details:userModel.token_symbol ?? "N/A" ),
                         new SectionModel(title: "Total Supply",details:userModel.token_total_supply ?? "N/A"  ),
                         new SectionModel(title: "Price",details:userModel.token_price ?? "N/A"  )
                       ]),
            new Padding(padding: const EdgeInsets.only(bottom: 5.0)),


          ],
        ),
    );
  }
}