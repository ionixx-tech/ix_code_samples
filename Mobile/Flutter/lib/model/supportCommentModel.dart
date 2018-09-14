
class SupportCommentModel   {

  String id;
  String first_name;
  String last_name;
  String email;
  String query;
  String type;
  int request_id;
  String time_stamp;

  String get full_name => (this.first_name + " " + this.last_name);
  String get tag => (this.first_name.substring(0,1).toUpperCase());

  SupportCommentModel(){

  }
  SupportCommentModel.fromJson(Map<String, dynamic> json){
    id = json['id'].toString();
    first_name = json['first_name'];
    last_name = json['last_name'];
    query = json['query'];
    email = json['email'];
    type = json['type'];
    request_id = json['request_id'];
    time_stamp = json['time_stamp'];
  }

  static List<SupportCommentModel> map(List<dynamic> items){
    List<SupportCommentModel> tmp_map = [];
    for (Map<String, dynamic> item in items){
      tmp_map.add(new SupportCommentModel.fromJson(item));
    }
    return tmp_map;
  }

}
