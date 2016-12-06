var hyperdom = require('hyperdom');
var Draggabilly = require('draggabilly');

function draggabillyComponent(options, element) {
  if (!element) {
    element = options;
  }
  return hyperdom.html.component(
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
