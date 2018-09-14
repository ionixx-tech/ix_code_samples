import 'package:dvs_hybrid/storage/usermanager.dart';


class AppConfic {
  static const String base_url = "http://192.168.1.38:8000/";
//  static const String base_url = "http://apps.ionixxtech.com:8000/";
}



abstract class APIPath {
  static const String login = "api/login/";
}

class TechAdmin extends APIPath{
  static const String tech_admin = "api/tech_admin/";
  static  String get change_password => ('api/user/' + UserManager.instance.userModel.id +"/change_password/");
  static  String get dashboard => (TechAdmin.tech_admin + UserManager.instance.userModel.id +"/dashboard/");
  static  String get get_ticket => (TechAdmin.tech_admin + "ticket/?received=True");
  static  String get bsp_list => (TechAdmin.tech_admin + UserManager.instance.userModel.id +"/bsp_list/");
  static  String get grade_user_list => (TechAdmin.tech_admin + UserManager.instance.userModel.id +"/get_grade_user/");
  static  String get ticket_list => (TechAdmin.tech_admin + UserManager.instance.userModel.id +"/ticket/?received=True/");
  static  String get comment_list => (TechAdmin.tech_admin + UserManager.instance.userModel.id +"/ticket/comment/");
}