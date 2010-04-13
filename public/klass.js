function __BootKlass__ (namespace) {
  function extend (target, source) {
    for(key in source) if(source.hasOwnProperty(key)) target[key] = source[key];
  }
  function Klass (parent, methods) {
    if(!parent) parent = Object;
    if(!methods && !parent.apply) {
      methods = parent; parent = Object;
    }
    if(!methods) methods = {};

    function klass() {
      parent && parent.apply(this, arguments);
      methods.initialize && methods.initialize.apply(this, arguments);
      return this;
    }
    function constructor() {
      // "this == window ? {} : this" Is a key part of this code.
      // the inheritance pattern depends on this check.
      // As it is recursive.
      return klass.apply(this == window ? {} : this, arguments);
    };
    constructor.prototype = jQuery.extend(new parent(), methods);
    return constructor;
  }
  window[namespace.Klass] = Klass;
};

__BootKlass__({
  Klass: "Klass"
});

// it = Klass({
//   initialize: function(attribute){
//     console.log("ATTRIBUTE", attribute)
//     this.attribute = attribute;
//   }
// })
// 
// other = Klass(it)
// me = other("foo")
// console.log("IS IT FOO", me.attribute)
// var GameBuilder = GB = {};
