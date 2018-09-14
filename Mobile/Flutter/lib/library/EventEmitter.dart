
typedef EventEmitterHandler = void Function(dynamic);

class EventEmitter{

  static final EventEmitter _emitter = new EventEmitter._internal();
  Map<String,List<EventEmitterHandler>> _eventMapping = Map();

  factory EventEmitter(){
    return _emitter;
  }
  EventEmitter._internal();

  void on(String event,EventEmitterHandler handler){
    var events =  _eventMapping[event];
    if(events==null){
      events=[];
    }
    events.add(handler);
    _eventMapping[event]=events;
  }
  void off(String event){
    _eventMapping.remove(event);
  }
  void emit(String event,dynamic object){
    var listOfHandler = _eventMapping[event];
    if(listOfHandler!=null){
      listOfHandler.forEach((void handler(dynamic data)){
          handler(object);
      });
    }
  }
  void remove(String event,EventEmitterHandler handler){
    _eventMapping.removeWhere((event,lists){
      return lists.contains(handler);
    });
  }

  void clear(){
    _eventMapping.clear();
  }
}