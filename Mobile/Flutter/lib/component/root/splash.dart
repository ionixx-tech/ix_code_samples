import 'dart:async';

import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:flutter/material.dart';
import 'package:dvs_hybrid/confic/route.dart';
import 'package:dvs_hybrid/storage/usermanager.dart';

class SplashPage extends StatefulWidget{
  
  @override
  _SplashPageState createState()=> new _SplashPageState();
}

class _SplashPageState extends State<SplashPage>{
  @override
    void initState() {
      // TODO: implement initState
      super.initState();
      UserManager.instance;
      new Timer(new Duration(seconds: 3),(){
          this.checkPage();
        });
    }
    checkPage(){
      UserManager.instance.get().then((obj){
        if (obj != null){
          Navigator.of(context).pushNamedAndRemoveUntil(RouteMapper.home, (Route<dynamic> route) => false);
        }else{
          Navigator.of(context).pushReplacementNamed(RouteMapper.login);
        }
      }).catchError((onError){
        Navigator.of(context).pushReplacementNamed(RouteMapper.login);
      });

    }
@override
  Widget build(BuildContext context){
    return new Scaffold(
      backgroundColor: AppTheme.primary,
      body: new Container(

        child: new Center(
          child: new Container(
            width: 260.0,
            height: 260.0,
            child: new Column(
              children: <Widget>[
                new Text("Document Verification System",
                  textAlign: TextAlign.center,
                  style: new TextStyle(
                      color: Colors.white,
                      fontSize: 20.0,
                      fontWeight: FontWeight.bold,
                    ),
                ),
                new Padding(
                  padding: const EdgeInsets.only(top:25.0),
                  child: new ImageView(AssetImageName.logo,
                  width:180.0,
                  height:180.0
                ),
                )
              ],
            ),
          ),
        ),
      )
    );
  }
}
