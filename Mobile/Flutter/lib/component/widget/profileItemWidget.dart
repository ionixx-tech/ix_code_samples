import 'package:dvs_hybrid/confic/theme.dart';
import 'package:dvs_hybrid/library/imageView.dart';
import 'package:dvs_hybrid/model/bspModel.dart';
import 'package:flutter/material.dart';


class ProfileItemWidget extends StatelessWidget{
  ProfileItemWidget({Key key,this.sectionModel}): super(key:key);
  final SectionModel sectionModel;

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return  new Container(
          padding: const EdgeInsets.all(10.0),
          child: new Column(
            children: <Widget>[
              new Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  new Expanded(
                    child: new Text(this.sectionModel.title),
                  ),
                  new Expanded(
//                margin: const EdgeInsets.only(left: 10.0),
                    child: new Text(this.sectionModel.details,
                      style: new TextStyle(
                          fontWeight: FontWeight.w600
                      ),
                    ),
                  ),

                ],
              ),
              new Padding(padding: const EdgeInsets.only(bottom:5.0)),
//              new Divider(
//                height: 1.0, color: Colors.grey,
//              )
            ],
          )
    );
  }

}
