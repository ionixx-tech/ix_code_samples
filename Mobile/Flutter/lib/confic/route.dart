import 'package:dvs_hybrid/component/tabbar/common/profile/profile.dart';
import 'package:dvs_hybrid/component/tabbar/common/support/support_list/support_list.dart';
import 'package:dvs_hybrid/component/tabbar/tsp/bsp/list/bsp_list.dart';
import 'package:dvs_hybrid/component/tabbar/bsp/profile/profile.dart';
import 'package:dvs_hybrid/component/tabbar/settings.dart';
import 'package:dvs_hybrid/component/tabbar/common/userlist/grade_userlist.dart';
import 'package:dvs_hybrid/component/tabbar/tsp/wallet/walltet_list.dart';
import 'package:flutter/material.dart';
import 'package:dvs_hybrid/component/root/splash.dart';
import 'package:dvs_hybrid/component/login/login.dart';
import 'package:dvs_hybrid/component/authendicate//forgotpassword.dart';
import 'package:dvs_hybrid/component/authendicate/changepassword.dart';
import 'package:dvs_hybrid/component/authendicate/sucess.dart';
import 'package:dvs_hybrid/component/root/home.dart';

class RouteMapper {
  
  static String splash = "splash";
  static String login = "login";
  static String home = "home";
  static String forgotpassword = "forgotpassword";
  static String changepassword = "changepassword";
  static String profile = "profile";
  static String grade_user_list = "grade_user_list";
  static String bsp_list = "bsp_list";
  static String bsp_profile = "bsp_profile";
  static String support_list = "support_list";
  static String wallet_list = "wallet_list";
  static String settings = "settings";
  static String sucess = "sucess";

 static  Map<String, WidgetBuilder> routes(){
      return {
        'splash': (BuildContext context) => new SplashPage(), //6
        'login': (BuildContext context) => new LoginPage(), //6
        'forgotpassword': (BuildContext context) => new ForgotPasswordPage(), //6
        'changepassword': (BuildContext context) => new ChangePasswordPage(), //6
        'home': (BuildContext context) => new HomePage(), //6
        'profile': (BuildContext context) => new ProfilePage(), //6
        'grade_user_list': (BuildContext context) => new GradeUserListPage(), //6
        'bsp_list': (BuildContext context) => new BSPListPage(),
        'bsp_profile': (BuildContext context) => new BSPProfile(),
        'support_list': (BuildContext context) => new SupportListPage(), //6
        'wallet_list': (BuildContext context) => new WalletListPage(), //6
        'settings': (BuildContext context) => new SettingsPage(), //6
        'sucess': (BuildContext context) => new SucessPage() //6
      };
  }
//   static  Map<String, MaterialPageRoute> routes(){
//       return {
//         "splash":  new MaterialPageRoute(builder: (context) => new SplashPage()),
//         "login":  new MaterialPageRoute(builder: (context) => new LoginPage()),
//         "forgotpassword":  new MaterialPageRoute(builder: (context) => new ForgotPasswordPage()),
//         "changepassword":  new MaterialPageRoute(builder: (context) => new ChangePasswordPage()),
//         "sucess":  new MaterialPageRoute(builder: (context) => new ChangePasswordPage()),
//         "home":  new MaterialPageRoute(builder: (context) => new HomePage())
//       };
//   }
}