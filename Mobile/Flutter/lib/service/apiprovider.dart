import 'dart:async';
import 'dart:convert' show utf8, json;
import 'dart:io';
import 'package:dvs_hybrid/confic/confic.dart';
import 'package:dvs_hybrid/library/EventEmitter.dart';
import 'package:dvs_hybrid/library/indicator.dart';
import 'package:dvs_hybrid/service/network_manager.dart';
import 'package:dvs_hybrid/storage/usermanager.dart';
import 'package:flutter/material.dart';

class APIProvider {

  static const String result = "result";
  static const String UNUTHORIZED_EVENT = "unauthorized";

  NetworkManager network;
  LoadingIndicator _indicator;
  BuildContext context;

  APIProvider(String path,{this.context}){
    assert(path!=null);
    this.network = new NetworkManager(baseurl:  AppConfic.base_url+path);
    var userModel = UserManager.instance.userModel;
    if (userModel != null){
      this.network.addHeader("Authorization", userModel.token);
      this.network.addHeader("username", userModel.username);
      this.network.addHeader("email", userModel.email);
    }
  }
  void _setindicator(){
    if (this.context !=null){
      _indicator = new LoadingIndicator(context:context);
      _indicator.show();
    }
  }
  void close(){
    if (this.context !=null){
      _indicator.dismiss();
    }
  }
  NetworkResponse _validateToken(NetworkResponse response){
    if(response.statusCode == 401){
      var events  = new EventEmitter();
      events.emit(APIProvider.UNUTHORIZED_EVENT, "unauth");
    }
    return response;
  }
  Future <NetworkResponse> get({Map<String, dynamic> param:const {}}) async {
    this._setindicator();
    return this._validateToken(await this.network.get(param));
  }

  Future <NetworkResponse> post( Map<String, dynamic> jsonBody) async {
    this._setindicator();
    return this._validateToken(await this.network.post(jsonBody));
  }
}