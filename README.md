# plastiq-draggabilly

A [plastiq](https://github.com/featurist/plastiq) component that makes elements
draggable using [draggabilly](https://github.com/desandro/draggabilly).

[Demo](http://www.featurist.co.uk/plastiq-draggabilly/)

## Example

```JavaScript
var plastiq = require('plastiq');
var draggable = require('plastiq-draggabilly');
var h = plastiq.html;

function render(model) {
  return h('.page',
    draggable(h('.red', 'Animal')),
    draggable({ grid: [20, 20] }, h('.green', 'Vegetable')),
    draggable({ axis: 'x' }, h('.blue', 'Mineral'))
  );
}

plastiq.append(document.body, render, {});
```

## License

MIT
