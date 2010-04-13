var CellPainterStateMachine = Klass(StateMachine, {                                    
  state: 'inactive'                                                                    
  ,states: ['inactive', 'fill', 'clear']                                               
  ,events: {                                                                           
    activate_fill: {                                                                   
      from:   ['inactive']                                                             
      ,to:    'fill'
      // Considering this option to define trigger.                                                                   
      // ,triggers: {                                                                     
      //   '.grid' => ['mousedown', 'mousemove']                                          
      // }                                                                                
      ,condition: function(){
        return Mouse.left.down && Mouse.over.is('.cell:not(.on)');
      }
      ,reaction: function() {                                                          
        Mouse.over.addClass('on');                                                     
        $('.cell').live('mouseover', function() { $(this).addClass('on'); });          
      }                                                                                
    }                                                                                  
    ,activate_clear: {                                                                 
      from:   ['inactive']                                                             
      ,to:    'clear'                                                                  
      // ,triggers: {                                                                     
      //   '.grid' => ['mousedown', 'mousemove']                                          
      // }                                                                                
      ,condition: function() {
        return Mouse.left.down && Mouse.over.is('.cell.on');
      }
      ,reaction: function() {                                                          
        Mouse.over.removeClass('on');                                                  
        $('.cell').live('mouseover', function() { $(this).removeClass('on'); });       
      }                                                                                
    }                                                                                  
    ,deactivate: {                                                                     
      from:   ['fill', 'clear']                                                        
      ,to:    'inactive'                                                               
      // ,triggers: {                                                                     
      //   document.body => ['mouseup']                                                   
      // }                                                                                
      ,condition: function() { 
        return Mouse.left.up 
      }                                                                                                                 
      ,reaction: function() {                                                          
        $('.cell').die('mouseover');                                                   
      }                                                                                
    }                                                                                  
  }                                                                                    
});                                                                                    

jQuery(function($) {
  function button (text, klass, parent) {
    return $(document.createElement('button')).addClass(klass).html(text).appendTo(parent);
  }
  function div (klass, parent) {
    return $(document.createElement('div')).addClass(klass).appendTo(parent);
  }
  function define_block () {
    $.ajax({
      type: 'post'
      ,url: 'http://localhost:8080/tetris/db/blocks'
      ,data: JSON.stringify({rotations: []})
      ,complete: function(xhr) {
        console.log(xhr.getResponseHeader("Location"))        
      }
      ,dataType: 'application/json'
    });
    var block = div('block', $('body'));
    button("Destroy Block", "destroy-block", block);
    button("Define Rotation", "create-rotation", block);
  }

  function define_rotation (block) {
    var grid = div('grid', block);
    for (var i=0; i < 4; i++) {
      var row = div('row', grid).attr('index', i);
      for (var ii=0; ii < 4; ii++) {
        var cell = div('cell', row).attr('index', ii)
      };
    };
    button("destroy", "destroy-rotation", grid);
    button("clone", "clone", grid);
    button("move left", "move-left", grid);
    button("move right", "move-right", grid);
  }
  button("Define Block", 'create-block', $('body'));

  $('button.create-block').live('click', define_block);
  $('button.destroy-block').live('click', function() {
    $(this).closest('.block').remove();
  });
  
  $('button.create-rotation').live('click', function() {
     define_rotation($(this).closest('.block')) 
  });
  $('button.destroy-rotation').live('click', function() {
    $(this).closest('.grid').remove();
  });
  $('button.move-left').live('click', function() {
    $(this).closest('.grid').each(function() {
        $(this).after($(this).prev);
    });
  });
  $('button.move-right').live('click', function() {
    $(this).closest('.grid').each(function() {
        $(this).before($(this).next());
    });    
  });
});
