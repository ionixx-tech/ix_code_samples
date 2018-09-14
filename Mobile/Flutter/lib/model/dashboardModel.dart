import 'dart:ui';


class DashboardModel   {

  int bsp_count=0;
  int owner_count=0;
  int ticket_resolved=4;
  int ticket_opened=2;
  int certificate_verified_total_count=0;
  int revenue=0;
  List<Token> tokens = [];

  DashboardModel();

  DashboardModel.fromJson(Map<String, dynamic> json){
    bsp_count = json['bsp_count'];
    owner_count = json['owner_count'];
    ticket_resolved = json['ticket_resolved'];
    ticket_opened = json['ticket_opened'];
    certificate_verified_total_count = json['certificate_verified_total_count'];
    revenue = json['revenue'];
    tokens = Token.map(json['token']);
  }
}

class Token{
  String coin_name;
  String symbol_name;
  double balance;
  double due_amount;
  Token();
//  List<Color> get colors => ([const Color(0xFFF06292), const Color(0xFFF48FB1)]);
  Token.fromJson(Map<String, dynamic> json){
    coin_name = json['coin_name'];
    symbol_name = json['symbol_name'];
    balance = json['balance'];
    due_amount = json['due_amount'];
  }
  static List<Token> map(List<dynamic> items){
    List<Token> tmp_map = [];
    for (Map<String, dynamic> item in items){
      tmp_map.add(new Token.fromJson(item));
    }
    return tmp_map;
  }

}