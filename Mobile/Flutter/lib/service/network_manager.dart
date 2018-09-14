library NetworkManager;
import 'dart:async';
import 'dart:convert' show utf8, json;
import 'dart:io';

class NetworkManager {

  final String baseurl;
  Map<String,dynamic> _header = new Map();
  var httpClient = new HttpClient();

  NetworkManager({this.baseurl});

  void addHeader(String key,dynamic value){
    _header[key]=value;
  }

  Future <NetworkResponse> get( Map<String, dynamic> jsonBody) async {
    var url_path = this.baseurl;
    var query = _queryString(jsonBody);
    if (query.length>0){
      url_path+="?"+query;
    }
     try{
       HttpClientRequest request = await this.httpClient.getUrl(Uri.parse(url_path));
       return await _getHttpClientRequest(request,jsonBody);
     }catch (e){
       NetworkResponse response = new NetworkResponse(statusCode: HttpStatus.NETWORK_CONNECT_TIMEOUT_ERROR);
       response.error_message = "unable to reach";
       return response;
     }
  }
  Future <NetworkResponse> post( Map<String, dynamic> jsonBody) async {
    HttpClientRequest request = await this.httpClient.postUrl(Uri.parse(this.baseurl));
    return await _getHttpClientRequest(request,jsonBody);
  }
  Future <NetworkResponse> put( Map<String, dynamic> jsonBody) async {
    HttpClientRequest request = await this.httpClient.putUrl(Uri.parse(this.baseurl));
    return await _getHttpClientRequest(request,jsonBody);
  }
  Future <NetworkResponse> delete( Map<String, dynamic> jsonBody) async {
    HttpClientRequest request = await this.httpClient.postUrl(Uri.parse(this.baseurl));
    return await _getHttpClientRequest(request,jsonBody);
  }
  Future<NetworkResponse> _getHttpClientRequest(HttpClientRequest request, Map<String, dynamic> jsonBody)async{
    final String stringBody = json.encode(jsonBody);
    request.headers.add(HttpHeaders.ACCEPT, ContentType.JSON);
    request.headers.contentType = ContentType.JSON;
    request.headers.contentLength = stringBody.length;
    request.headers.chunkedTransferEncoding = false;
    for (String key in this._header.keys){
      request.headers.add(key, this._header[key]);
    }
    request.write(stringBody);
    HttpClientResponse response = await request.close();
    NetworkResponse networkResponse = new NetworkResponse(statusCode: response.statusCode);
    if (response.statusCode != HttpStatus.OK) {
      try{
        networkResponse.error_message = response.reasonPhrase;
      }catch (e){
        e.error_message = e.toString();
      }
      return networkResponse;
//      throw new StateError(
//          'Server responded with error: ${response.statusCode} ${response.reasonPhrase}');
    }
    var string_json_response = await response.transform(utf8.decoder).join();
    networkResponse.json_object = json.decode(string_json_response);
    return networkResponse;
  }

  String _queryString(Map<String,dynamic> dict){
    var query = "";
     for (String key in dict.keys){
       var value = dict[key];
       query+="$key=$value&";
     }
     if (dict.keys.length>0){
       query=query.substring(0,query.length-1);
     }
    return query;
  }
}

 class NetworkResponse{
  dynamic json_object;
  String error_message;
  int statusCode;

  bool get isSucess => statusCode == HttpStatus.OK;
  NetworkResponse({this.statusCode});
}