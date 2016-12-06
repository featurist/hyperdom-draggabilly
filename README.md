# hyperdom-draggabilly

A [hyperdom](https://github.com/featurist/hyperdom) component that makes elements
draggable using [draggabilly](https://github.com/desandro/draggabilly).

[Demo](http://www.featurist.co.uk/hyperdom-draggabilly/)

## Example

```JavaScript
var hyperdom = require('hyperdom');
var draggable = require('hyperdom-draggabilly');
var h = hyperdom.html;

function render(model) {
  return h('.page',
    draggable(h('.red', 'Animal')),
    draggable({ grid: [20, 20] }, h('.green', 'Vegetable')),
    draggable({ axis: 'x' }, h('.blue', 'Mineral'))
  );
}

hyperdom.append(document.body, render, {});
```

## License

MIT
