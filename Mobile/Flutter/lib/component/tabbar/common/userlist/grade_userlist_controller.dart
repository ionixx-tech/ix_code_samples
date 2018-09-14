
import 'dart:async';

import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/model/userModel.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/service/network_manager.dart';
import 'package:flutter/material.dart';

class GradeUserListController{

  Future<List<UserModel>> userlist(BuildContext context) async{
    APIProvider request = new APIProvider(TechAdmin.grade_user_list,context: context);
    NetworkResponse response = await request.get(param: {"page":"1"});
    request.close();
    if (response.isSucess){
//      var m = Mapping.map(UserModel, response.json_object[APIProvider.result]);
      var items_list = UserModel.map(response.json_object[APIProvider.result]);
      return items_list;
    }
    return [];
  }
}