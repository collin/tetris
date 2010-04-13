var NullQuery = $([]);
var MouseButtons = {
  0: 'left'
  ,2: 'right'
}
StateMachine = Klass({
  initialize: function(){
    StateMachine.machines.push(this);
  }
  
  ,canditate_transitions: function() {
    var transitions = [];
    for(key in this.events) {
      if(!this.events.hasOwnProperty(key)) continue;
      if(this.events[key].from.indexOf(this.state) != -1) {
        transitions.push(this.events[key]); 
      }
    }
    return transitions;
  }
    
  ,react: function(){
    console.info("StateMachine#react", this)
    var test = this.canditate_transitions(), result, _event, condition, i, ii;
    for (i = test.length - 1; i >= 0; i--){
      _event = test[i];
      result = true;
      console.info("StateMachine Event test", _event)
      if(!_event.condition()) {
        result = false; break;
      }
      if(result) {
        _event.reaction();
        console.info("StateMachine state=", _event.to, this);
        this.state = _event.to;
        break;
      }
    };
  }
});

StateMachine.machines = [];
StateMachine.register = function(machine) {
  StateMachine.machine.push(machine);
};
StateMachine.react = function(event_name, callback) {
  console.info("StateMachine.react", event_name, callback);
  $('body').live(event_name, function(event) {
    console.info("StateMachine.react Callback:", event_name);
    callback(event);
    for (var i = StateMachine.machines.length - 1; i >= 0; i--) {
      StateMachine.machines[i].react();
    };
  });
  return StateMachine;
};

// Initial State of Mouse
var Mouse = {
   left:    { down: false }
  ,right:   { down: false }
  ,over:    NullQuery
  ,entered: NullQuery
};

// Reactors to update state of mouse.
StateMachine
  .react('mouseup', function(event) {
    Mouse[MouseButtons[event.button]].down = false;
    Mouse[MouseButtons[event.button]].up = true;
  })
  .react('mousedown', function(event) {
    Mouse[MouseButtons[event.button]].down = true;
    Mouse[MouseButtons[event.button]].up = false;
  })
  .react('mouseover', function(event) {
    Mouse.over = $(event.target);    
  })
  .react('mouseout', function(event) {
    Mouse.over = NullQuery;
  })
  .react('mouseenter', function(event) {
    Mouse.inside = $(event.target);    
  })
  .react('mouseleave', function(event) {
    Mouse.inside = NullQuery;
  });
