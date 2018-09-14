
import 'dart:async';

import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/model/bspModel.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/service/network_manager.dart';
import 'package:flutter/material.dart';

class BSPListController{

  Future<List<BSPModel>> userlist(BuildContext context) async{
    APIProvider request = new APIProvider(TechAdmin.bsp_list,context: context);
    NetworkResponse response = await request.get();
    request.close();
    if (response.isSucess){
      var items_list = BSPModel.map(response.json_object[APIProvider.result]);
      return items_list;
    }
    return [];
  }
}