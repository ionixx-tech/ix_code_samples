
class BSPModel   {

  String id;
  String first_name;
  String last_name;
  String email;
  String user_type;
  String organization_name;
  String organization_id;
  String payment_gateway_credential;
  String token_name;
  String token_total_supply;
  String token_symbol;
  String token_price;
  String phone_number;
  String address;
  bool is_active;

  String get full_name => (this.first_name + " " + this.last_name);
  String get tag => (this.organization_name.substring(0,1).toUpperCase());

  BSPModel(){

  }
  BSPModel.fromJson(Map<String, dynamic> json){
    id = json['id'].toString();
    first_name = json['first_name'];
    last_name = json['last_name'];
    email = json['email'];
    user_type = json['user_type'];
    organization_name = json['organization_name'];
    organization_id = json['organization_id'].toString();
    payment_gateway_credential = json['payment_gateway_credential'];
    token_name = json['token_name'];
    token_total_supply = json['token_total_supply'].toString();
    token_symbol = json['token_symbol'];
    token_price = json['token_price'].toString();
    phone_number = json['phone_number'].toString();
    address = json['address'];
    is_active = json['is_active'];
  }

  static List<BSPModel> map(List<dynamic> items){
    List<BSPModel> tmp_map = [];
    for (Map<String, dynamic> item in items){
      tmp_map.add(new BSPModel.fromJson(item));
    }
    return tmp_map;
  }

}

class SectionModel{
  SectionModel({this.title,this.details});
  String title;
  String details;

}