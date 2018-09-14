import 'package:dvs_hybrid/component/tabbar/common/dashboard/dashboard_controller.dart';
import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:dvs_hybrid/model/dashboardModel.dart';
import 'package:flutter/material.dart';
import 'package:flutter_circular_chart/flutter_circular_chart.dart';

class DashboardPage extends StatefulWidget{
  @override
    _DashboardPageState createState() => new _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage>{
  final GlobalKey<AnimatedCircularChartState> _chartKey = new GlobalKey<AnimatedCircularChartState>();
  DashboardModel dashboardModel = new DashboardModel();
  List<CircularStackEntry> data=[];
    @override
    initState(){
      _getDashobord();
    }
  void _getDashobord()async{
      DashboardController dashboardController = new DashboardController();
      var dash = await dashboardController.dashboard(context);
      double resolve = dash.ticket_resolved.toDouble();
      double open = dash.ticket_opened.toDouble();
      this.data = <CircularStackEntry>[
        new CircularStackEntry(
          <CircularSegmentEntry>[
            new CircularSegmentEntry(resolve, AppTheme.primary, rankKey: 'Q1'),
            new CircularSegmentEntry(open, AppTheme.secondary, rankKey: 'Q2'),
          ],
          rankKey: ' Profits',
        ),
      ];
      if (dash != null) {
        var section = new Token();
        section.coin_name = "Coin";
        section.symbol_name = "Symbol";
        dash.tokens.insert(0, section);

        setState(() { dashboardModel = dash;
        _chartKey.currentState.updateData(this.data);
        });
      }
    }

  Widget _getTile(String title,String subTitle){
    return new Card(
      child: new Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          new Padding(padding: const EdgeInsets.only(bottom: 5.0)),
          new Text(title,style: new TextStyle(
            fontWeight: FontWeight.bold
          ),),
          new Padding(padding: const EdgeInsets.only(bottom: 5.0)),
          new Text(subTitle),
          new Padding(padding: const EdgeInsets.only(bottom: 5.0)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context){
    double width =   MediaQuery.of(context).size.width/2.0;
    double height =   MediaQuery.of(context).size.width/2.5;
    return new Scaffold(
      appBar: new AppBar(title: new Text("Dashboard"),),
      body: new Column(
        children: <Widget>[
          new Container(
              margin: const EdgeInsets.all(4.0),
            height: height,
            child: new GridView.count(crossAxisCount: 2,
            controller: new ScrollController(keepScrollOffset:false),
            childAspectRatio: 2.60,
            children: <Widget>[
              _getTile("BSP",this.dashboardModel.bsp_count.toString()),
              _getTile("Document Owner",this.dashboardModel.owner_count.toString()),
              _getTile("Certificate Verified",this.dashboardModel.certificate_verified_total_count.toString()),
              _getTile("Revenue",this.dashboardModel.revenue.toString()),
            ],
            )
          ),
          new Container(child: new Card(
              child: new Center(
                child: new Row(
                  children: <Widget>[

                    new AnimatedCircularChart(
                      key: _chartKey,
                      size: new Size(width, width),
                      initialChartData: this.data,
                      chartType: CircularChartType.Radial,
                    ),
                    new Container(
                      margin: const EdgeInsets.only(top: 10.0,left: 5.0,right: 5.0),
                      child: new Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: <Widget>[
                          new Container(
                              child: new Row(
                                children: <Widget>[
                                  new Chip(label: new Text(this.dashboardModel.ticket_opened.toString(),style: new TextStyle(
                                      color: Colors.white
                                  ),) ,backgroundColor: AppTheme.secondary),
                                  new Text("  Open Ticket" ,style: new TextStyle(
                                      color: Colors.black,fontWeight: FontWeight.bold
                                  ),)
                                ],
                              )
                          ),
                          new Padding(padding: const EdgeInsets.only(bottom: 30.0)),
                          new Container(
                              child: new Row(
                                children: <Widget>[
                                  new Chip(label: new Text(this.dashboardModel.ticket_resolved.toString(),style: new TextStyle(
                                      color: Colors.white
                                  ),) ,backgroundColor: AppTheme.primary),
                                  new Text("  Resolve Ticket " ,style: new TextStyle(
                                      color: Colors.black,fontWeight: FontWeight.bold
                                  ),)
                                ],
                              )
                          ),
                        ],
                      ) ,
                    ),
                  ],
                )
              )
          ),

          ),
          new Flexible(
            child:  new Container(
              child: new ListView.builder(itemBuilder: cellForIndex,
                padding: new EdgeInsets.all(2.0),
                itemCount: this.dashboardModel.tokens.length,
              ),
            )
          )
        ],
      )
    );
  }
  Widget cellForIndex(BuildContext context,int idx) {
      Token token = this.dashboardModel.tokens[idx];
      var section = idx==0 ? "Balance":token.balance.toString();
      var style = null;
      if (idx == 0){style = new TextStyle(
          fontWeight: FontWeight.bold
      );
      }
    return new Card(
      child: new Padding(padding: const EdgeInsets.all(5.0),
        child: new Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            new Expanded(
              child:             new Text(token.coin_name, style: style,),
            ),new Expanded(
              child:             new Text(token.symbol_name, style: style,),
            ),new Expanded(
              child:             new Text(section, style: style,),
            ),
          ],
        ),
      )
    );
  }
}