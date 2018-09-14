
import 'package:flutter/material.dart';


class SupportModel   {

  String id;
  String title;
  String query;
  String user_type;
  String status;
  String time_stamp;

  Color get color => ( this.status == "resolved" ? Colors.green : Colors.red );
  String get tag => ( this.status.substring(0,1).toUpperCase() );


  SupportModel.fromJson(Map<String, dynamic> json){
    id = json['id'].toString();
    title = json['title'];
    query = json['query'];
    user_type = json['user_type'];
    status = json['status'];
    time_stamp = json['time_stamp'];
  }

  static List<SupportModel> map(List<dynamic> items){
    List<SupportModel> tmp_map = [];
    for (Map<String, dynamic> item in items){
      tmp_map.add(new SupportModel.fromJson(item));
    }
    return tmp_map;
  }

}
