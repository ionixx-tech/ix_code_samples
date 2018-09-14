import 'package:dvs_hybrid/component/login/loginController.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:flutter/material.dart';
import 'package:dvs_hybrid/confic/route.dart';

class LoginPage extends StatefulWidget{

  @override
  _LoginPageState createState() => new _LoginPageState();

}

class _LoginPageState extends State<LoginPage>{
  final TextEditingController usernameController = new TextEditingController(text: "alexappadurai.swamydhas@ionixxtech.com");
  final TextEditingController passwordController = new TextEditingController(text: "admin@123");
  int _counter = 0;
  @override
  initState(){
  }
  void showInSnackBar(String value) {
//    Scaffold.of(context).showSnackBar(new SnackBar(
//      content: new Text('Hello!'),
//    ));
//    Scaffold.of(context).showSnackBar(new SnackBar(
//      content: new Text('This is snackbar #$value.'),
//      action: new SnackBarAction(
//          label: 'ACTION',
//          onPressed: () {
//            Scaffold.of(context).showSnackBar(new SnackBar(
//                content: new Text('You pressed snackbar $value\'s action.')
//            ));
//          }
//      ),
//    ));

  }
  _onPressLogin() async{

    LoginController loginController = new LoginController();
    loginController.login(context, usernameController.text, passwordController.text).then((response){
      if (response.isSucess){
        Navigator.of(context).pushNamedAndRemoveUntil(RouteMapper.home, (Route<dynamic> route) => false);
      }else{
        showInSnackBar("Some text");
      }
    });

//    final LoadingIndicator indicator = new LoadingIndicator(context:context);
//    indicator.show();
//    final APIProvider request = new APIProvider(APIPath.login);
//    request.post({
//      "email":usernameController.text,
//      "password":passwordController.text
//    }).then((jsonobject) {
//        print(jsonobject);
//        // ignore: argument_type_not_assignable
//         UserManager.instance.save(jsonobject[APIProvider.result]);
//        Navigator.of(context).pushNamedAndRemoveUntil(RouteMapper.home, (Route<dynamic> route) => false);
//        request.close();
//    }).catchError((onError){
//       print(onError);
//       request.close();
//     });
  }
  _onPressForgotPassword(){
    Navigator.of(context).pushNamed(RouteMapper.forgotpassword);
  }
  Widget build(BuildContext context){
    return new Scaffold(
      body: new Stack(
        children: <Widget>[ 
          new Positioned(
            child: new Container( 
            ),
            top: 0.0,
            left:0.0,
            right: 0.0,
            bottom: 0.0,
          ),
          new Center(
          child: new Container(
            width: 280.0,
            height: 230.0,
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
                      new TextField(
                        obscureText: true,
                        autocorrect: false,
                        maxLength: 12,
                        controller: passwordController,
                        decoration: new InputDecoration(
                          hintText: "Password"
                        ),
                      ),
                      new FlatButton(
                        onPressed: _onPressLogin,
                        color: AppTheme.secondary,
                        child: new Text("Login" ,
                          style: new TextStyle(fontWeight: FontWeight.bold,color: Colors.white),
                        ),
                      ),
                      new FlatButton(
                        onPressed: _onPressForgotPassword,
                        highlightColor: Colors.white,
                        child: new Text("Forgot Password" ,
                          style: new TextStyle(fontWeight: FontWeight.w100,color: AppTheme.primary),
                        ),
                      ),
                    ], ),
                  ),
            )
          )
        ),
        ]),
    );
  }
}

