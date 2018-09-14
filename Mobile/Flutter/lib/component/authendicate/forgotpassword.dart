import 'package:dvs_hybrid/confic/theme.dart';
import 'package:flutter/material.dart';

class ForgotPasswordPage extends StatefulWidget{
  @override
  _ForgotPasswordPageState createState() => new _ForgotPasswordPageState();

}

class _ForgotPasswordPageState extends State<ForgotPasswordPage>{
  final TextEditingController usernameController = new TextEditingController();
  final TextEditingController passwordController = new TextEditingController();
  _onLoginPress(){

  }
  Widget build(BuildContext context){
    return new Scaffold(
      appBar: new AppBar(title: new Text("Forgot Password")),
      body: new Container(
        child: new Center(
          child: new Container(
            width: 280.0,
            height: 180.0, 
            child: new Card(
              child: new Padding(
                padding: const EdgeInsets.all(10.0),
                child: new Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      new TextField(
                        controller: usernameController,
                        maxLength: 64,
                        decoration: new InputDecoration(
                          hintText: "Email ID",
                        ),
                      ),
                      new FlatButton(
                        onPressed: _onLoginPress,
                        color: AppTheme.secondary,
                        child: new Text("VERIFY" ,
                          style: new TextStyle(fontWeight: FontWeight.bold,color: Colors.white),
                        ),
                      ),
                     
                    ],
                  ),
                  ),
            )
          )
        ),
      ),
    );
  }
}