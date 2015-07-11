var plastiq = require('plastiq');
var Draggabilly = require('draggabilly');

function draggabillyComponent(options, element) {
  if (!element) {
    element = options;
  }
  return plastiq.html.component(
    {
      onadd: function (element) {
        this.draggie = new Draggabilly(element, options);
      },
      onupdate: function (element) {
      }
    },
    element
  );
}

module.exports = draggabillyComponent;
