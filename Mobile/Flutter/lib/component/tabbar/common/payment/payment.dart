import 'package:dvs_hybrid/confic/asset.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:flutter/material.dart';
import 'package:flutter_circular_chart/flutter_circular_chart.dart';

class WalletPage extends StatefulWidget{
  @override
    _WalletPageState createState() => new _WalletPageState();
}

class _WalletPageState extends State<WalletPage>{
  final GlobalKey<AnimatedCircularChartState> _chartKey = new GlobalKey<AnimatedCircularChartState>();

    @override
    initState(){
    }

    void _cycleSamples() {
      List<CircularStackEntry> nextData = <CircularStackEntry>[
    new CircularStackEntry(
      <CircularSegmentEntry>[
        new CircularSegmentEntry(1500.0, Colors.red[200], rankKey: 'Q1'),
        new CircularSegmentEntry(750.0, Colors.green[200], rankKey: 'Q2'),
        new CircularSegmentEntry(2000.0, Colors.blue[200], rankKey: 'Q3'),
        new CircularSegmentEntry(1000.0, Colors.yellow[200], rankKey: 'Q4'),
      ],
      rankKey: 'Quarterly Profits',
    ),
  ];
  setState(() {
    _chartKey.currentState.updateData(nextData);
  });
}
  @override
  Widget build(BuildContext context){
 List<CircularStackEntry> data = <CircularStackEntry>[
  new CircularStackEntry(
    <CircularSegmentEntry>[
      new CircularSegmentEntry(500.0, Colors.red, rankKey: 'Q1'),
      new CircularSegmentEntry(1000.0, Colors.green, rankKey: 'Q2'),
      new CircularSegmentEntry(2000.0, Colors.blue, rankKey: 'Q3'),
      new CircularSegmentEntry(1000.0, Colors.yellow, rankKey: 'Q4'),
    ],
    rankKey: 'Quarterly Profits',
  ),
];
    return new Scaffold(
      body: new Column(
        children: <Widget>[
          new Text("da AME \n char"
          ),
          new Text("data"),
          new Container(
            margin: const EdgeInsets.all(4.0),
            width: 20.0,
            height: 20.0,
            child: new ImageView(AssetImageName.logo,
                    fit : BoxFit.contain
          ),
          ),
          new Container(
            child: new Center(
              child: new AnimatedCircularChart(
              key: _chartKey,
              size: const Size(300.0, 300.0),
              initialChartData: data,
              chartType: CircularChartType.Radial,
            ),
            )
          )
        ],
      )
    );
  }
}