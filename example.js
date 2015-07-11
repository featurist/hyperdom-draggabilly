var plastiq = require('plastiq');
var draggable = require('../');
var h = plastiq.html;

function render(model) {
  return h('.page',
    draggable(h('.red', 'Animal')),
    draggable({ grid: [20, 20] }, h('.green', 'Vegetable')),
    draggable({ axis: 'x' }, h('.blue', 'Mineral'))
  );
}

plastiq.append(document.getElementById('example'), render, {});
