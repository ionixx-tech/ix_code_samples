import 'dart:async';

import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/storage/usermanager.dart';
import 'package:dvs_hybrid/service/network_manager.dart';
import 'package:flutter/material.dart';

class LoginController{

  Future<NetworkResponse> login(BuildContext context,String email,String password) async{

    APIProvider request = new APIProvider(APIPath.login,context: context);
    NetworkResponse response = await request.post({
      "email":email,
      "password":password
    });
     request.close();
    if (response.isSucess){
      print(response.json_object);
      UserManager.instance.save(response.json_object[APIProvider.result]);
    }
     return response;
  }
}