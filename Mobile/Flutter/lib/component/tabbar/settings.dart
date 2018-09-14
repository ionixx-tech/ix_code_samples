import 'package:dvs_hybrid/component/tabbar/common/profile/profile.dart';
import 'package:dvs_hybrid/component/widget/cardItemWidget.dart';
import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/confic/route.dart';
import 'package:dvs_hybrid/library/alertView.dart';
import 'package:dvs_hybrid/storage/usermanager.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class SettingsPage extends StatefulWidget{
  @override
  _SettingState createState() => new _SettingState();

}

class _SettingState extends State<SettingsPage>{
  @override
  initState(){
  }
  List<Widget> _getItems(){
    List<Widget> items = [
      new CardItemWidget(title:"Profile",image: AssetImageName.profile, onPress: this._onPressProfileClicked),
      new CardItemWidget(title:"Payment List",image: AssetImageName.wallet, onPress: this._onPressClicked),
      new CardItemWidget(title:"Grade User",image: AssetImageName.manage_user, onPress: this._onPressUserClicked),
      new CardItemWidget(title:"Change password",image: AssetImageName.change_password, onPress: this._onPressChangePasswordClicked),
      new CardItemWidget(title:"Support",image: AssetImageName.support, onPress: this._onPressSupportClicked),
      new CardItemWidget(title:"Privacy Policy",image: AssetImageName.privacy_policy, onPress: this._onPressPrivacyClicked),
      new CardItemWidget(title:"Terms & Condition",image: AssetImageName.terms_condition, onPress: this._onPressTermsClicked),
      new CardItemWidget(title:"Logout",image: AssetImageName.logout, onPress: this._onPressLogoutClicked),
    ];
    return items;
  }
//  Button Action
  _onPressLogoutClicked(CardItemWidget wdget){
    var alert = new BasicAlertView(context,"Logout!","Are you sure,do you want logout?");
    alert.addAlertViewAction(new AlertViewAction(title: "Cancel",callback: (action){
      print("tag cancel");
    }));
    alert.addAlertViewAction(new AlertViewAction(title: "OK",titleColor: Colors.red,callback: (action){
      print("tag ok");
      UserManager.instance.logout();
      Navigator.of(context).pushReplacementNamed(RouteMapper.login);
    }));
    alert.show();
    print(wdget.title);
  }
  _onPressUserClicked(CardItemWidget wdget){
    Navigator.of(context).pushNamed(RouteMapper.grade_user_list);
  }
  _onPressClicked(CardItemWidget wdget){
    Navigator.of(context).pushNamed(RouteMapper.grade_user_list);
  }
  _onPressChangePasswordClicked(CardItemWidget wdget){
    Navigator.of(context).pushNamed(RouteMapper.changepassword);
  }
  _onPressProfileClicked(CardItemWidget wdget){
    ProfilePage.Navigate(context, UserManager.instance.userModel);
//    Navigator.of(context).pushNamed(RouteMapper.profile);
  }
  _onPressSupportClicked(CardItemWidget wdget){
    Navigator.of(context).pushNamed(RouteMapper.support_list);
  }
  _onPressPrivacyClicked(CardItemWidget wdget){
    this._launchURL("https://flutter.io");
  }
  _onPressTermsClicked(CardItemWidget wdget){
    this._launchURL("https://flutter.io");
  }

  _launchURL(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new Scaffold(
      appBar: new AppBar(title: new Text("Settings")),
      body: new Container(
          margin: const EdgeInsets.only(top: 10.0),
          child: new ListView(

            children: this._getItems(),
          )
      ),
    );
  }
}



