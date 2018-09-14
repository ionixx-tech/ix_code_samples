import 'dart:core';

import 'dart:ui';

import 'package:flutter/material.dart';

class UserModel {

  String id;
  String username;
  String user_role;
  String first_name;
  String last_name;
  String email;
  String name;
  String user_type;
  String token;

  String get full_name => (this.first_name + " " + this.last_name);
  String get tag => (this.user_role.substring(0,1).toUpperCase());

  Color colors(){
    Color clr = Colors.cyan;
    switch (this.tag){
      case "A":
        clr = Colors.red;
        break;
      case "F":
        clr = Colors.green;
      break;
      case "S":
        clr = Colors.blue;
        break;
      default:
        break;

    }
    return clr;
  }

  UserModel({this.id, this.username, this.user_role,
      this.first_name, this.last_name, this.email,
      this.name, this.user_type, this.token
      });

  UserModel.fromJson(Map<String, dynamic> json){
    id = json['id'].toString();
    username = json['username'];
    user_role = json['user_role'];
    first_name = json['first_name'];
    last_name = json['last_name'];
    email = json['email'];
    user_type = json['user_type'];
    token = json['token'];
    if (json['user_email']!=null){
      email = json['user_email'];
      username = email;
    }
  }

  // ignore: missing_function_body
//  Map<String, dynamic> toJson() =>
//      {
//        'id': id,
//        'username': username,
//        'user_role': user_role,
//        'first_name': first_name,
//        'last_name': last_name,
//        'name': name,
//        'email': email,
//        'user_type': user_type,
//        'token': token,
//      };
  static List<UserModel> map(List<dynamic> items){
    List<UserModel> tmp_map = [];
    for (Map<String, dynamic> item in items){
      tmp_map.add(new UserModel.fromJson(item));
    }
    return tmp_map;
  }
}
//class JSONModel{
//
//}
//class Mapping{
//
//  static  List<T> map<JSONModel,T>( JSONModel  classType,List<dynamic> items) {
//    List<T> tmp_map = [];
//    for (Map<String, dynamic> item in items){
//      // ignore: strong_mode_invalid_cast_new_expr, new_with_non_type
//      tmp_map.add(new type.fromJson(item));
//    }
//    return tmp_map;
//  }
//}