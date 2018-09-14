import 'package:dvs_hybrid/library/imageView.dart';
import 'package:flutter/material.dart';

abstract class TabWidget {
}
class BasicTabWidget extends TabWidget {
   final String title;
   final  String icon;
   Widget child;
   BasicTabWidget({this.child , this.title, this.icon}){
     assert(this.child!=null);
   }
}
class CustomizeTabWidget extends TabWidget {
   Text normalTitle;
   Text selectedTitle;
   Widget normalIcon;
   Widget selectedIcon;
   Widget child;
   CustomizeTabWidget({this.child , this.normalIcon, this.selectedIcon,this.normalTitle,this.selectedTitle}){
          assert(this.child!=null);
   }
}
class TabBarController extends StatefulWidget{

  TabBarController({
    Key key,
    this.currentIndex : 0,
    this.items,
    this.normalColor:Colors.grey,
    this.selectedColor:Colors.blue,
    this.backgroundColor:Colors.white
    }): assert(items != null),
        assert(items.length >= 2),
        assert(0 <= currentIndex && currentIndex < items.length),
        super(key:key);

  final int currentIndex; 
  final List<TabWidget> items; 
  final Color selectedColor;
  final Color normalColor;
  final Color backgroundColor;

  @override
  _TabBarControllerState createState()=> new _TabBarControllerState();
   
}

class _TabBarControllerState extends State<TabBarController>{
  
  int currentIndex = 0;
  @override
  void initState() {
    super.initState();
    this.currentIndex = widget.currentIndex;
  }
   
  onTapTabBar(int idx){
    currentIndex = idx;
    setState((){
      currentIndex=idx;
    });
    print(idx);
  }
  BottomNavigationBarItem bottomBarList(int index){
   TabWidget item = widget.items[index];
  Widget title ;
  Widget icon;
  bool isSelected = (index == this.currentIndex);
  Color cColor = isSelected ? this.widget.selectedColor : this.widget.normalColor;
    if (item.runtimeType == BasicTabWidget){
       BasicTabWidget basicTabWidget = item;
        title =  new Text(basicTabWidget.title,
          style: new TextStyle(
            color:cColor 
          ),
        );
        icon =  new Container(
            margin: const EdgeInsets.only(bottom: 5.0),
            width: 20.0,
            height: 20.0,
            child: new ImageView(basicTabWidget.icon,
            tintColor: cColor,
          ));
      }else{
        CustomizeTabWidget cw = item;
        title = isSelected ? cw.selectedTitle : cw.normalTitle;
        icon = isSelected ? cw.normalIcon : cw.selectedIcon;
      }
       
      return new BottomNavigationBarItem(title:title,icon: icon);
}
  Offstage containChild(int idx){
     TabWidget item = widget.items[idx];
     Widget child;
    if (item is BasicTabWidget){
      child = item.child;
    }else if (  item is CustomizeTabWidget){
      child = item.child;
    }
  return new Offstage(offstage: idx != currentIndex,child: new TickerMode(
    enabled: idx == currentIndex,
    child: child,
  ));
}
@override
  Widget build(BuildContext context) {
    // TODO: implement build
    int length = widget.items.length;
    return new DefaultTabController(
      length: length,
      child: new Scaffold(
        bottomNavigationBar: new BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          currentIndex: currentIndex,
          onTap: onTapTabBar,
          items: new List<BottomNavigationBarItem>.generate(length,bottomBarList ),
        ),
        body: new Stack(
          children: new List<Offstage>.generate(length, containChild),
        )
      ),
    );
  }

}