
import 'package:dvs_hybrid/component/tabbar/common/dashboard/dashboard.dart';
import 'package:dvs_hybrid/component/tabbar/settings.dart';
import 'package:dvs_hybrid/component/tabbar/tsp/bsp/list/bsp_list.dart';
import 'package:dvs_hybrid/component/tabbar/tsp/wallet/walltet_list.dart';
import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/confic/route.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/alertView.dart';
import 'package:dvs_hybrid/library/tabbar.dart';
import 'package:dvs_hybrid/service/apiprovider.dart';
import 'package:dvs_hybrid/storage/usermanager.dart';
import 'package:flutter/material.dart';
import 'package:dvs_hybrid/library/EventEmitter.dart';

class HomePage extends StatefulWidget{
  @override
  _HomePageState createState() => new _HomePageState();
}
class _HomePageState extends State<HomePage>{
  bool isUnAuthorized = false;
  @override
    void initState() {
      super.initState();
      var event = EventEmitter();
      event.on(APIProvider.UNUTHORIZED_EVENT, (name) {
        this.unauthorizedEvent(name);
      });

    }
  void  unauthorizedEvent(dynamic object){
      if(isUnAuthorized){return;}
      isUnAuthorized=true;
//      new Timer(new Duration(seconds: 3),(){
        var alert = new BasicAlertView(context,"Expire Session!","Your session has been expired");
        alert.addAlertViewAction(new AlertViewAction(title: "OK",titleColor: Colors.red,callback: (action){
          print("tag ok");
          UserManager.instance.logout();
          Navigator.of(context).pushReplacementNamed(RouteMapper.login);
        }));
        alert.show();
//      });

//      UserManager.instance.logout();
//      Navigator.of(context).pushReplacementNamed(RouteMapper.login);
//

    }
    List<TabWidget> _renderWidget(){
      List<TabWidget> item = <TabWidget>[];
      item.add(new BasicTabWidget(
          child: new DashboardPage(),
          title: "Dashboard",
          icon: AssetImageName.dashboard
        ));
      item.add(new BasicTabWidget(
          child: new WalletListPage(),
          title: "Wallet",
          icon: AssetImageName.wallet
        ));
      item.add(new BasicTabWidget(
          child: new BSPListPage(),
          title: "BSP",
          icon: AssetImageName.profile
      ));
      item.add(new BasicTabWidget(
          child: new SettingsPage(),
          title: "Settings",
          icon: AssetImageName.settings
        ));
      return  item;
    }
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new TabBarController(
       selectedColor: AppTheme.secondary,
      items: this._renderWidget(),
    );
  }
}