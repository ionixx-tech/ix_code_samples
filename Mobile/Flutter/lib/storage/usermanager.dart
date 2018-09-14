import 'dart:convert';


import 'package:flutter_localstorage/flutter_localstorage.dart';
import 'package:dvs_hybrid/model/userModel.dart';

class UserManager {

   UserModel userModel;
   LocalStorage _localStorage = new LocalStorage();

  // ignore: initializer_for_non_existent_field, missing_function_body
  static  const String kUserKey = "user";

    get()async{
//    final SharedPreferences prefs =  SharedPreferences.getInstance();
    var stringjson = _localStorage.getItem(kUserKey);
    if (stringjson == null){
      return null;
    }
    var jsonobject = jsonDecode(stringjson);
    var uobj = new UserModel.fromJson(jsonobject);
    UserManager.instance.userModel = uobj;
    return uobj;
  }
  save(dynamic jsonobject)  {
    this.userModel = new UserModel.fromJson(jsonobject);
    String jsonData = json.encode(jsonobject); // convert map to String
    _localStorage.setItem(UserManager.kUserKey, jsonData);
  }

  logout(){
      this.userModel = null;
    _localStorage.removeItem(kUserKey);
  }

   static  final UserManager _instance = new UserManager._intenal();
    factory UserManager(){
        return _instance;
    }
    static UserManager get instance => _instance;
  // ignore: initializer_for_non_existent_field
   UserManager._intenal();
}