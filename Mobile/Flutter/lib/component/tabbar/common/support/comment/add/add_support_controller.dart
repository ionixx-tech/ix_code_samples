
import 'dart:async';

import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/model/supportModel.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/service/network_manager.dart';
import 'package:flutter/material.dart';

class AddSupportController{

   Future<List<SupportModel>> getSupportTicket(BuildContext context) async{
    APIProvider request = new APIProvider(TechAdmin.ticket_list,context: context);
    NetworkResponse response = await request.get(param: {"page":"1"});
    request.close();
    if (response.isSucess){
      var items_list = SupportModel.map(response.json_object[APIProvider.result]);
      return items_list;
    }
    return [];
  }
}