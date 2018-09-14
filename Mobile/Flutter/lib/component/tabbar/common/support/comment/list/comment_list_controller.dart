
import 'dart:async';

import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/model/supportCommentModel.dart';
import 'package:dvs_hybrid/model/supportModel.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/service/network_manager.dart';
import 'package:flutter/material.dart';

class CommentListController{

   Future<List<SupportCommentModel>> getSupportComments(BuildContext context,SupportModel supportModel) async{
    APIProvider request = new APIProvider(TechAdmin.comment_list,context: context);
    NetworkResponse response = await request.get(param: {"ticket_id":supportModel.id});
    request.close();
    if (response.isSucess){
      var items_list = SupportCommentModel.map(response.json_object[APIProvider.result]);
      return items_list;
    }
    return [];
  }
}