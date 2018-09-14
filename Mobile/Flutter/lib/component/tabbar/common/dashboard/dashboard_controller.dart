
import 'dart:async';

import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/model/bspModel.dart';
import 'package:dvs_hybrid/model/dashboardModel.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/service/network_manager.dart';
import 'package:flutter/material.dart';

class DashboardController{

  Future<DashboardModel> dashboard(BuildContext context) async{
    APIProvider request = new APIProvider(TechAdmin.dashboard,context: context);
    NetworkResponse response = await request.get();
    request.close();
    if (response.isSucess){
      // ignore: const_with_non_const

      var items_list = new DashboardModel.fromJson(response.json_object[APIProvider.result]);
      return items_list;
    }
    return null;
  }
}