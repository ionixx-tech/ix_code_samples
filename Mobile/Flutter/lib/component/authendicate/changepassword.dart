import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/toast.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/service/network_manager.dart';
import 'package:flutter/material.dart';

class ChangePasswordPage extends StatefulWidget{
  @override
  _ChangePasswordPageState createState() => new _ChangePasswordPageState();

}


class _ChangePasswordPageState extends State<ChangePasswordPage>{
  final TextEditingController passwordController = new TextEditingController();
  final TextEditingController confirmPasswordController = new TextEditingController();

  _onForgotPress() async{
    if (passwordController.text.trim().length <8 || confirmPasswordController.text.trim().length <8){
//      Toast.show(context);

      return;
    }
    Map<String,dynamic> param  = new Map();
    param["new_password"]=passwordController.text;
    param["reenter_password"]=confirmPasswordController.text;
    param["old_password"]=confirmPasswordController.text;
    APIProvider request = new APIProvider(TechAdmin.change_password,context: context);
    NetworkResponse response = await request.post(param);
    request.close();
    if(response.isSucess){
      print("sucesss");
      Navigator.of(context).pop();
    }
  }
  Widget build(BuildContext context){
    return new Scaffold(
      appBar: new AppBar(title: new Text("Change Password")),
      body: new Container(
        child: new Center(
          child: new Container(
            width: 280.0,
            height: 220.0,
            child: new Card(
              child: new Padding(
                padding: const EdgeInsets.all(10.0),
                child: new Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      new TextField(
                        controller: passwordController,
                        obscureText: true,
                        autocorrect: false,
                        maxLength: 12,
                        decoration: new InputDecoration(
                          hintText: "Password",
                        ),
                      ),
                       new TextField(
                        controller: confirmPasswordController,
                        obscureText: true,
                        autocorrect: false,
                        maxLength: 12,
                        decoration: new InputDecoration(
                          hintText: "Confirm Password",
                        ),
                      ),
                      new FlatButton(
                        onPressed: _onForgotPress,
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