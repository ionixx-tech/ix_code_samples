import 'package:dvs_hybrid/component/root/splash.dart';
import 'package:flutter/material.dart';
import 'confic/theme.dart';
import 'package:dvs_hybrid/confic/route.dart';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
//  RouteSettings _generalRoute()
//  Route<dynamic> _getRoute(RouteSettings settings) {
//    return  (BuildContext context) => new ChangePasswordPage(), //6
//
//  }
    @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'DVC',
      theme: new ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or press Run > Flutter Hot Reload in IntelliJ). Notice that the
        // counter didn't reset back to zero; the application is not restarted.
        primarySwatch: AppTheme.primary,
      ),
      home: new SplashPage(),
      routes:  RouteMapper.routes(),

    );
  }
}
/*
routes: <String,WidgetBuilder>{
        "root":(BuildContext conext)=> new ForgotPasswordPage(),
        "forgotPassword":(BuildContext conext)=> new ForgotPasswordPage(),
      },
*/