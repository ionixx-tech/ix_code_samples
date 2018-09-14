import 'package:dvs_hybrid/component/tabbar/common/dashboard/dashboard_controller.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/gradientView.dart';
import 'package:dvs_hybrid/model/dashboardModel.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_circular_chart/flutter_circular_chart.dart';

class WalletListPage extends StatefulWidget{
  @override
    _WalletPageListState createState() => new _WalletPageListState();
}

class _WalletPageListState extends State<WalletListPage>{
  final GlobalKey<AnimatedCircularChartState> _chartKey = new GlobalKey<AnimatedCircularChartState>();
  DashboardModel dashboardModel = new DashboardModel();

  @override
  initState(){
    _getDashobord();
  }
  void onPress(){

  }
  void _getDashobord()async{
    DashboardController dashboardController = new DashboardController();
    var dash = await dashboardController.dashboard(context);
    if (dash != null) {
      setState(() { dashboardModel = dash;  });
    }
  }
  //BuildContext context,
    Widget cellForIndex(int idx){
    Token token = this.dashboardModel.tokens[idx];
        return  new GridTile(child:
        new Card(child: new GradientView(
          padding: const EdgeInsets.all(5.0),
//          colors: [const Color(0xFFff80b3),const Color(0xFFffe6f0)],
          colors: [const Color(0xFFFFFFFF),const Color(0xFFFFFFFF)],
          child: new Column(
            crossAxisAlignment: CrossAxisAlignment.start ,
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: <Widget>[
              new Padding(
                child: new Text(" " + token.coin_name + " - " + token.symbol_name, textAlign: TextAlign.center,style: new TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary)),
                padding: const EdgeInsets.only(top: 5.0,bottom: 5.0),
              ),
              new Container(
                child: new Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    new Container(
                      child: new Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          new Text("Balance", style: new TextStyle(fontWeight: FontWeight.bold, color: AppTheme.secondary)),
                          new Padding(padding: const EdgeInsets.only(top: 10.0)),
                          new Text(""+token.balance.toString())
                        ],
                      ),
                    ),
                    new Flexible(
                      child: new Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          new Text("Pending Payment", textAlign: TextAlign.center,
                            style: new TextStyle(fontWeight: FontWeight.bold, color: AppTheme.secondary),),
                          new Padding(padding: const EdgeInsets.only(top: 10.0)),
                          new Text(""+token.due_amount.toString()),
                        ],
                      ),
                    )
                  ],
                ),
              )
            ],
          ),
        )));
    }
  @override
  Widget build(BuildContext context){

    final Orientation orientation = MediaQuery.of(context).orientation;

    return new Scaffold(
      appBar: new AppBar(title: new Text("Wallets"),),
      body: new GridView.count(crossAxisCount: 1,childAspectRatio:3.50,children: new List.generate(this.dashboardModel.tokens.length, cellForIndex),),
//      body: new GridView.builder(
//        itemCount: dashboardModel.tokens.length,
//        gridDelegate: new SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: (orientation == Orientation.portrait ? 1 : 2)),
//          itemBuilder: cellForIndex
//      )
    );
  }
}