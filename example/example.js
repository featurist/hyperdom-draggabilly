var hyperdom = require('hyperdom');
var draggable = require('../');
var h = hyperdom.html;

function render(model) {
  return h('.page',
    draggable(h('.red', 'Animal')),
    draggable({ grid: [20, 20] }, h('.green', 'Vegetable')),
    draggable({ axis: 'x' }, h('.blue', 'Mineral'))
  );
}

hyperdom.append(document.getElementById('example'), render, {});
