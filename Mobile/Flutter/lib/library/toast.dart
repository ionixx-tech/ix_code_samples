
import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

class Toast extends StatelessWidget{

  static void show(BuildContext context){
    Navigator.of(context, rootNavigator: true).push(new _ToastRoute(
      child: new Toast(), // ignore: deprecated_member_use
      theme: Theme.of(context, shadowThemeOnly: false),
      barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
    ));
  }
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new Container(
      child: new Text("sssss"),
    );
  }

}

class _ToastRoute<T> extends PopupRoute<T> {
  _ToastRoute({
    @required this.theme,
    bool barrierDismissible: false,
    this.barrierLabel,
    @required this.child,
    RouteSettings settings,
  }) : assert(barrierDismissible != null),
        _barrierDismissible = barrierDismissible,
        super(settings: settings);

  final Widget child;
  final ThemeData theme;

  @override
  Duration get transitionDuration => const Duration(milliseconds: 150);

  @override
  bool get barrierDismissible => _barrierDismissible;
  final bool _barrierDismissible;

  @override
  Color get barrierColor => Colors.black54;

  @override
  final String barrierLabel;

  @override
  Widget buildPage(BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation) {
    return new Container(
      child: new Builder(
          builder: (BuildContext context) {
            return theme != null ? new Theme(data: theme, child: child) : child;
          }
      ),
    );
  }

  @override
  Widget buildTransitions(BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
    return new FadeTransition(
        opacity: new CurvedAnimation(
            parent: animation,
            curve: Curves.easeOut
        ),
        child: child
    );
  }
}