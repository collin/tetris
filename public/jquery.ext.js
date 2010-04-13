jQuery.ensureClass = function(className) {
  if(!this.hasClass(className)) this.addClass(className);
  return this;
}
