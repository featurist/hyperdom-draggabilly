(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../":2,"hyperdom":14}],2:[function(require,module,exports){
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

},{"draggabilly":7,"hyperdom":14}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],5:[function(require,module,exports){
/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = classie;
} else {
  // browser global
  window.classie = classie;
}

})( window );

},{}],6:[function(require,module,exports){
/*!
 * getStyleProperty v1.0.4
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {

'use strict';

var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
  if ( !propName ) {
    return;
  }

  // test standard property first
  if ( typeof docElemStyle[ propName ] === 'string' ) {
    return propName;
  }

  // capitalize
  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

  // test vendor specific properties
  var prefixed;
  for ( var i=0, len = prefixes.length; i < len; i++ ) {
    prefixed = prefixes[i] + propName;
    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
      return prefixed;
    }
  }
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( function() {
    return getStyleProperty;
  });
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = getStyleProperty;
} else {
  // browser global
  window.getStyleProperty = getStyleProperty;
}

})( window );

},{}],7:[function(require,module,exports){
/*!
 * Draggabilly v1.2.4
 * Make that shiz draggable
 * http://draggabilly.desandro.com
 * MIT license
 */

( function( window, factory ) {
  'use strict';

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        'classie/classie',
        'get-style-property/get-style-property',
        'get-size/get-size',
        'unidragger/unidragger'
      ],
      function( classie, getStyleProperty, getSize, Unidragger ) {
        return factory( window, classie, getStyleProperty, getSize, Unidragger );
      });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('desandro-classie'),
      require('desandro-get-style-property'),
      require('get-size'),
      require('unidragger')
    );
  } else {
    // browser global
    window.Draggabilly = factory(
      window,
      window.classie,
      window.getStyleProperty,
      window.getSize,
      window.Unidragger
    );
  }

}( window, function factory( window, classie, getStyleProperty, getSize, Unidragger ) {

'use strict';

// vars
var document = window.document;

function noop() {}

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

// ----- get style ----- //

var defView = document.defaultView;

var getStyle = defView && defView.getComputedStyle ?
  function( elem ) {
    return defView.getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };


// http://stackoverflow.com/a/384380/182183
var isElement = ( typeof HTMLElement == 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj == 'object' &&
      obj.nodeType == 1 && typeof obj.nodeName == 'string';
  };

// -------------------------- requestAnimationFrame -------------------------- //

// https://gist.github.com/1866474

var lastTime = 0;
var prefixes = 'webkit moz ms o'.split(' ');
// get unprefixed rAF and cAF, if present
var requestAnimationFrame = window.requestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame;
// loop through vendor prefixes and get prefixed rAF and cAF
var prefix;
for( var i = 0; i < prefixes.length; i++ ) {
  if ( requestAnimationFrame && cancelAnimationFrame ) {
    break;
  }
  prefix = prefixes[i];
  requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
  cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] ||
                            window[ prefix + 'CancelRequestAnimationFrame' ];
}

// fallback to setTimeout and clearTimeout if either request/cancel is not supported
if ( !requestAnimationFrame || !cancelAnimationFrame )  {
  requestAnimationFrame = function( callback ) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
    var id = window.setTimeout( function() {
      callback( currTime + timeToCall );
    }, timeToCall );
    lastTime = currTime + timeToCall;
    return id;
  };

  cancelAnimationFrame = function( id ) {
    window.clearTimeout( id );
  };
}

// -------------------------- support -------------------------- //

var transformProperty = getStyleProperty('transform');
// TODO fix quick & dirty check for 3D support
var is3d = !!getStyleProperty('perspective');

var jQuery = window.jQuery;

// --------------------------  -------------------------- //

function Draggabilly( element, options ) {
  // querySelector if string
  this.element = typeof element == 'string' ?
    document.querySelector( element ) : element;

  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }

  // options
  this.options = extend( {}, this.constructor.defaults );
  this.option( options );

  this._create();
}

// inherit Unidragger methods
extend( Draggabilly.prototype, Unidragger.prototype );

Draggabilly.defaults = {
};

/**
 * set options
 * @param {Object} opts
 */
Draggabilly.prototype.option = function( opts ) {
  extend( this.options, opts );
};

Draggabilly.prototype._create = function() {

  // properties
  this.position = {};
  this._getPosition();

  this.startPoint = { x: 0, y: 0 };
  this.dragPoint = { x: 0, y: 0 };

  this.startPosition = extend( {}, this.position );

  // set relative positioning
  var style = getStyle( this.element );
  if ( style.position != 'relative' && style.position != 'absolute' ) {
    this.element.style.position = 'relative';
  }

  this.enable();
  this.setHandles();

};

/**
 * set this.handles and bind start events to 'em
 */
Draggabilly.prototype.setHandles = function() {
  this.handles = this.options.handle ?
    this.element.querySelectorAll( this.options.handle ) : [ this.element ];

  this.bindHandles();
};

/**
 * emits events via eventEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
Draggabilly.prototype.dispatchEvent = function( type, event, args ) {
  var emitArgs = [ event ].concat( args );
  this.emitEvent( type, emitArgs );
  var jQuery = window.jQuery;
  // trigger jQuery event
  if ( jQuery && this.$element ) {
    if ( event ) {
      // create jQuery event
      var $event = jQuery.Event( event );
      $event.type = type;
      this.$element.trigger( $event, args );
    } else {
      // just trigger with type if no event available
      this.$element.trigger( type, args );
    }
  }
};

// -------------------------- position -------------------------- //

// get left/top position from style
Draggabilly.prototype._getPosition = function() {
  // properties
  var style = getStyle( this.element );

  var x = parseInt( style.left, 10 );
  var y = parseInt( style.top, 10 );

  // clean up 'auto' or other non-integer values
  this.position.x = isNaN( x ) ? 0 : x;
  this.position.y = isNaN( y ) ? 0 : y;

  this._addTransformPosition( style );
};

// add transform: translate( x, y ) to position
Draggabilly.prototype._addTransformPosition = function( style ) {
  if ( !transformProperty ) {
    return;
  }
  var transform = style[ transformProperty ];
  // bail out if value is 'none'
  if ( transform.indexOf('matrix') !== 0 ) {
    return;
  }
  // split matrix(1, 0, 0, 1, x, y)
  var matrixValues = transform.split(',');
  // translate X value is in 12th or 4th position
  var xIndex = transform.indexOf('matrix3d') === 0 ? 12 : 4;
  var translateX = parseInt( matrixValues[ xIndex ], 10 );
  // translate Y value is in 13th or 5th position
  var translateY = parseInt( matrixValues[ xIndex + 1 ], 10 );
  this.position.x += translateX;
  this.position.y += translateY;
};

// -------------------------- events -------------------------- //

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Draggabilly.prototype.pointerDown = function( event, pointer ) {
  this._dragPointerDown( event, pointer );
  // kludge to blur focused inputs in dragger
  var focused = document.activeElement;
  if ( focused && focused.blur ) {
    focused.blur();
  }
  // bind move and end events
  this._bindPostStartEvents( event );
  classie.add( this.element, 'is-pointer-down' );
  this.dispatchEvent( 'pointerDown', event, [ pointer ] );
};

/**
 * drag move
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Draggabilly.prototype.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.dispatchEvent( 'pointerMove', event, [ pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

/**
 * drag start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Draggabilly.prototype.dragStart = function( event, pointer ) {
  if ( !this.isEnabled ) {
    return;
  }
  this._getPosition();
  this.measureContainment();
  // position _when_ drag began
  this.startPosition.x = this.position.x;
  this.startPosition.y = this.position.y;
  // reset left/top style
  this.setLeftTop();

  this.dragPoint.x = 0;
  this.dragPoint.y = 0;

  // reset isDragging flag
  this.isDragging = true;
  classie.add( this.element, 'is-dragging' );
  this.dispatchEvent( 'dragStart', event, [ pointer ] );
  // start animation
  this.animate();
};

Draggabilly.prototype.measureContainment = function() {
  var containment = this.options.containment;
  if ( !containment ) {
    return;
  }

  this.size = getSize( this.element );
  var elemRect = this.element.getBoundingClientRect();

  // use element if element
  var container = isElement( containment ) ? containment :
    // fallback to querySelector if string
    typeof containment == 'string' ? document.querySelector( containment ) :
    // otherwise just `true`, use the parent
    this.element.parentNode;

  this.containerSize = getSize( container );
  var containerRect = container.getBoundingClientRect();

  this.relativeStartPosition = {
    x: elemRect.left - containerRect.left,
    y: elemRect.top  - containerRect.top
  };
};

// ----- move event ----- //

/**
 * drag move
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Draggabilly.prototype.dragMove = function( event, pointer, moveVector ) {
  if ( !this.isEnabled ) {
    return;
  }
  var dragX = moveVector.x;
  var dragY = moveVector.y;

  var grid = this.options.grid;
  var gridX = grid && grid[0];
  var gridY = grid && grid[1];

  dragX = applyGrid( dragX, gridX );
  dragY = applyGrid( dragY, gridY );

  dragX = this.containDrag( 'x', dragX, gridX );
  dragY = this.containDrag( 'y', dragY, gridY );

  // constrain to axis
  dragX = this.options.axis == 'y' ? 0 : dragX;
  dragY = this.options.axis == 'x' ? 0 : dragY;

  this.position.x = this.startPosition.x + dragX;
  this.position.y = this.startPosition.y + dragY;
  // set dragPoint properties
  this.dragPoint.x = dragX;
  this.dragPoint.y = dragY;

  this.dispatchEvent( 'dragMove', event, [ pointer, moveVector ] );
};

function applyGrid( value, grid, method ) {
  method = method || 'round';
  return grid ? Math[ method ]( value / grid ) * grid : value;
}

Draggabilly.prototype.containDrag = function( axis, drag, grid ) {
  if ( !this.options.containment ) {
    return drag;
  }
  var measure = axis == 'x' ? 'width' : 'height';

  var rel = this.relativeStartPosition[ axis ];
  var min = applyGrid( -rel, grid, 'ceil' );
  var max = this.containerSize[ measure ] - rel - this.size[ measure ];
  max = applyGrid( max, grid, 'floor' );
  return  Math.min( max, Math.max( min, drag ) );
};

// ----- end event ----- //

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Draggabilly.prototype.pointerUp = function( event, pointer ) {
  classie.remove( this.element, 'is-pointer-down' );
  this.dispatchEvent( 'pointerUp', event, [ pointer ] );
  this._dragPointerUp( event, pointer );
};

/**
 * drag end
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Draggabilly.prototype.dragEnd = function( event, pointer ) {
  if ( !this.isEnabled ) {
    return;
  }
  this.isDragging = false;
  // use top left position when complete
  if ( transformProperty ) {
    this.element.style[ transformProperty ] = '';
    this.setLeftTop();
  }
  classie.remove( this.element, 'is-dragging' );
  this.dispatchEvent( 'dragEnd', event, [ pointer ] );
};

// -------------------------- animation -------------------------- //

Draggabilly.prototype.animate = function() {
  // only render and animate if dragging
  if ( !this.isDragging ) {
    return;
  }

  this.positionDrag();

  var _this = this;
  requestAnimationFrame( function animateFrame() {
    _this.animate();
  });

};

// transform translate function
var translate = is3d ?
  function( x, y ) {
    return 'translate3d( ' + x + 'px, ' + y + 'px, 0)';
  } :
  function( x, y ) {
    return 'translate( ' + x + 'px, ' + y + 'px)';
  };

// left/top positioning
Draggabilly.prototype.setLeftTop = function() {
  this.element.style.left = this.position.x + 'px';
  this.element.style.top  = this.position.y + 'px';
};

Draggabilly.prototype.positionDrag = transformProperty ?
  function() {
    // position with transform
    this.element.style[ transformProperty ] = translate( this.dragPoint.x, this.dragPoint.y );
  } : Draggabilly.prototype.setLeftTop;

// ----- staticClick ----- //

Draggabilly.prototype.staticClick = function( event, pointer ) {
  this.dispatchEvent( 'staticClick', event, [ pointer ] );
};

// ----- methods ----- //

Draggabilly.prototype.enable = function() {
  this.isEnabled = true;
};

Draggabilly.prototype.disable = function() {
  this.isEnabled = false;
  if ( this.isDragging ) {
    this.dragEnd();
  }
};

Draggabilly.prototype.destroy = function() {
  this.disable();
  // reset styles
  if ( transformProperty ) {
    this.element.style[ transformProperty ] = '';
  }
  this.element.style.left = '';
  this.element.style.top = '';
  this.element.style.position = '';
  // unbind handles
  this.unbindHandles();
  // remove jQuery data
  if ( this.$element ) {
    this.$element.removeData('draggabilly');
  }
};

// ----- jQuery bridget ----- //

// required for jQuery bridget
Draggabilly.prototype._init = noop;

if ( jQuery && jQuery.bridget ) {
  jQuery.bridget( 'draggabilly', Draggabilly );
}

// -----  ----- //

return Draggabilly;

}));

},{"desandro-classie":5,"desandro-get-style-property":6,"get-size":9,"unidragger":28}],8:[function(require,module,exports){
/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( window );

},{}],9:[function(require,module,exports){
/*!
 * getSize v1.2.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false, console: false */

( function( window, undefined ) {

'use strict';

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') === -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- setup -------------------------- //

var isSetup = false;

var getStyle, boxSizingProp, isBoxSizeOuter;

/**
 * setup vars and functions
 * do it on initial getSize(), rather than on script load
 * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  var getComputedStyle = window.getComputedStyle;
  getStyle = ( function() {
    var getStyleFn = getComputedStyle ?
      function( elem ) {
        return getComputedStyle( elem, null );
      } :
      function( elem ) {
        return elem.currentStyle;
      };

      return function getStyle( elem ) {
        var style = getStyleFn( elem );
        if ( !style ) {
          logError( 'Style returned ' + style +
            '. Are you running this code in a hidden iframe on Firefox? ' +
            'See http://bit.ly/getsizebug1' );
        }
        return style;
      };
  })();

  // -------------------------- box sizing -------------------------- //

  boxSizingProp = getStyleProperty('boxSizing');

  /**
   * WebKit measures the outer-width on style.width on border-box elems
   * IE & Firefox measures the inner-width
   */
  if ( boxSizingProp ) {
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style[ boxSizingProp ] = 'border-box';

    var body = document.body || document.documentElement;
    body.appendChild( div );
    var style = getStyle( div );

    isBoxSizeOuter = getStyleSize( style.width ) === 200;
    body.removeChild( div );
  }

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem === 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display === 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
    style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

  // get all measurements
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    value = mungeNonPixel( elem, value );
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
  // IE8 and has percent value
  if ( window.getComputedStyle || value.indexOf('%') === -1 ) {
    return value;
  }
  var style = elem.style;
  // Remember the original values
  var left = style.left;
  var rs = elem.runtimeStyle;
  var rsLeft = rs && rs.left;

  // Put in the new values to get a computed value out
  if ( rsLeft ) {
    rs.left = elem.currentStyle.left;
  }
  style.left = value;
  value = style.pixelLeft;

  // Revert the changed values
  style.left = left;
  if ( rsLeft ) {
    rs.left = rsLeft;
  }

  return value;
}

return getSize;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD for RequireJS
  define( [ 'get-style-property/get-style-property' ], defineGetSize );
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = defineGetSize( require('desandro-get-style-property') );
} else {
  // browser global
  window.getSize = defineGetSize( window.getStyleProperty );
}

})( window );

},{"desandro-get-style-property":6}],10:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":3}],11:[function(require,module,exports){
var VText = require("virtual-dom/vnode/vtext.js")
var domComponent = require('./domComponent');
var hyperdom = require('.');
var deprecations = require('./deprecations');

function ComponentWidget(state, vdom) {
  if (!vdom) {
    throw new Error('hyperdom.html.component([options], vdom) expects a vdom argument');
  }

  this.state = state;
  this.key = state.key;
  var currentRender = hyperdom.currentRender();

  if (typeof vdom === 'function') {
    this.render = function () {
      if (currentRender) {
        currentRender.eventHandlerWrapper = state.on;
      }
      return vdom.apply(this.state, arguments);
    };
    this.canRefresh = true;
  } else {
    vdom = vdom || new VText('');
    this.render = function () {
      return vdom;
    }
  }
  this.cacheKey = state.cacheKey;
  this.component = domComponent();

  var renderFinished = currentRender && currentRender.finished;
  if (renderFinished) {
    this.afterRender = function (fn) {
      renderFinished.then(fn);
    };
  } else {
    this.afterRender = function () {};
  }
}

ComponentWidget.prototype.type = 'Widget';

ComponentWidget.prototype.init = function () {
  var self = this;

  if (self.state.onbeforeadd) {
    self.state.onbeforeadd();
  }

  var vdom = this.render(this);
  if (vdom instanceof Array) {
    throw new Error('vdom returned from component cannot be an array');
  }

  var element = this.component.create(vdom);

  if (self.state.onadd) {
    this.afterRender(function () {
      self.state.onadd(element);
    });
  }

  if (self.state.detached) {
    return document.createTextNode('');
  } else {
    return element;
  }
};

ComponentWidget.prototype.update = function (previous) {
  var self = this;

  var refresh = !this.cacheKey || this.cacheKey !== previous.cacheKey;

  if (refresh) {
    if (self.state.onupdate) {
      this.afterRender(function () {
        self.state.onupdate(self.component.element);
      });
    }
  }

  this.component = previous.component;

  if (previous.state && this.state) {
    var keys = Object.keys(this.state);
    for(var n = 0; n < keys.length; n++) {
      var key = keys[n];
      previous.state[key] = self.state[key];
    }
    this.state = previous.state;
  }

  if (refresh) {
    var element = this.component.update(this.render(this));

    if (self.state.detached) {
      return document.createTextNode('');
    } else {
      return element;
    }
  }
};

ComponentWidget.prototype.refresh = function () {
  this.component.update(this.render(this));
  if (this.state.onupdate) {
    this.state.onupdate(this.component.element);
  }
};

ComponentWidget.prototype.rerender = ComponentWidget.prototype.refresh;

ComponentWidget.prototype.destroy = function (element) {
  var self = this;

  if (self.state.onremove) {
    this.afterRender(function () {
      self.state.onremove(element);
    });
  }

  this.component.destroy();
};

module.exports = function (state, vdom) {
  deprecations.component('hyperdom.html.component is deprecated, please use ViewModels');
  if (typeof state === 'function') {
    return new ComponentWidget({}, state);
  } else if (state.constructor === Object) {
    return new ComponentWidget(state, vdom);
  } else {
    return new ComponentWidget({}, state);
  }
};

module.exports.ComponentWidget = ComponentWidget;

},{".":14,"./deprecations":12,"./domComponent":13,"virtual-dom/vnode/vtext.js":50}],12:[function(require,module,exports){
function deprecationWarning() {
  var warningIssued = false;

  return function (arg) {
    if (!warningIssued) {
      console.warn(arg);
      warningIssued = true;
    }
  };
}

module.exports = {
  refresh: deprecationWarning(),
  currentRender: deprecationWarning(),
  window: deprecationWarning(),
  component: deprecationWarning(),
  renderFunction: deprecationWarning(),
  refreshAfter: deprecationWarning(),
  norefresh: deprecationWarning()
};

},{}],13:[function(require,module,exports){
var createElement = require('virtual-dom/create-element');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var toVdom = require('./toVdom');
var isVdom = require('./isVdom');

function DomComponent(options) {
  this.document = options && options.document;
}

function prepareVdom(object) {
  var vdom = toVdom(object);
  if (!isVdom(vdom)) {
    throw new Error('expected render to return vdom');
  } else {
    return vdom;
  }
}

DomComponent.prototype.create = function (vdom) {
  this.vdom = prepareVdom(vdom);
  return this.element = createElement(this.vdom, {document: this.document});
};

DomComponent.prototype.merge = function (vdom, element) {
  this.vdom = prepareVdom(vdom);
  return this.element = element;
};

DomComponent.prototype.update = function (vdom) {
  var oldVdom = this.vdom;
  this.vdom = prepareVdom(vdom);
  var patches = diff(oldVdom, this.vdom);
  return this.element = patch(this.element, patches);
};

DomComponent.prototype.destroy = function (options) {
  function destroyWidgets(vdom) {
    if (vdom.type === 'Widget') {
      vdom.destroy();
    } else if (vdom.children) {
      vdom.children.forEach(destroyWidgets);
    }
  }

  destroyWidgets(this.vdom);

  if (options && options.removeElement && this.element.parentNode) {
    this.element.parentNode.removeChild(this.element);
  }
};

function domComponent(options) {
  return new DomComponent(options);
}

module.exports = domComponent;

},{"./isVdom":15,"./toVdom":23,"virtual-dom/create-element":30,"virtual-dom/diff":31,"virtual-dom/patch":32}],14:[function(require,module,exports){
if (typeof window === 'object') {
  console.log('\n\ncreated with \uD83D\uDE80 using https://github.com/featurist/hyperdom\n\n\n');
}

var rendering = require('./rendering');
var deprecations = require('./deprecations');

exports.html = rendering.html;
exports.jsx = rendering.jsx;
exports.attach = rendering.attach;
exports.replace = rendering.replace;
exports.append = rendering.append;
exports.appendVDom = rendering.appendVDom;
exports.merge = rendering.merge;
exports.binding = rendering.binding;
exports.meta = rendering.html.meta;
exports.refreshify = rendering.html.refreshify;
exports.norefresh = rendering.html.norefresh;

var windowEvents = require('./windowEvents');

exports.html.window = function (attributes) {
  deprecations.window('hyperdom.window is deprecated');
  return windowEvents(attributes);
};

exports.html.component = require('./component');

exports.currentRender = function () {
  return exports._currentRender;
};

},{"./component":11,"./deprecations":12,"./rendering":19,"./windowEvents":26}],15:[function(require,module,exports){
var virtualDomVersion = require("virtual-dom/vnode/version")

module.exports = function(x) {
  var type = x.type;
  if (type == 'VirtualNode' || type == 'VirtualText') {
    return x.version == virtualDomVersion;
  } else {
    return type == 'Widget' || type == 'Thunk';
  }
};

},{"virtual-dom/vnode/version":47}],16:[function(require,module,exports){
module.exports = function (model, property) {
  var hyperdomMeta = model._hyperdomMeta;

  if (!hyperdomMeta) {
    hyperdomMeta = {};
    Object.defineProperty(model, '_hyperdomMeta', {value: hyperdomMeta});
  }

  if (property) {
    var meta = hyperdomMeta[property];

    if (!meta) {
      meta = hyperdomMeta[property] = {};
    }

    return meta;
  } else {
    return hyperdomMeta;
  }
};

},{}],17:[function(require,module,exports){
var hyperdomMeta = require('./meta');
var runRender = require('./runRender');
var hyperdom = require('.');
var Set = require('./set');

var lastId = 0;

function Mount(model, options) {
  var win = (options && options.window) || window;
  this.requestRender = (options && options.requestRender) || win.requestAnimationFrame || win.setTimeout;

  this.model = model;

  this.renderQueued = false;
  this.mountRenderRequested = false;
  this.widgetRendersRequested = undefined;
  this.id = ++lastId;
  this.mounted = true;
}

Mount.prototype.queueRender = function () {
  if (!this.renderQueued) {
    var requestRender = this.requestRender;
    var self = this;

    requestRender(function () {
      self.renderQueued = false;

      if (self.mounted) {
        runRender(self, function () {
          if (self.mountRenderRequested) {
            var vdom = self.render();
            self.component.update(vdom);
            self.mountRenderRequested = false;
          } else if (self.widgetRendersRequested && self.widgetRendersRequested.length) {
            for (var i = 0, l = self.widgetRendersRequested.length; i < l; i++) {
              var w = self.widgetRendersRequested[i];
              w.rerender();
            }
            self.widgetRendersRequested = undefined;
          }
        });
      }
    });

    this.renderQueued = true;
  }
};

Mount.prototype.render = function() {
  return this.renderViewModel(this.model);
};

Mount.prototype.rerender = function () {
  this.mountRenderRequested = true;
  this.queueRender();
};

Mount.prototype.rerenderWidget = function (widget) {
  if (!this.widgetRendersRequested) {
    this.widgetRendersRequested = [];
  }

  this.widgetRendersRequested.push(widget);
  this.queueRender();
};

Mount.prototype._renderViewModel = function(model) {
  var self = this;

  model.rerender = function () {
    self.rerender();
  };
  model.rerenderViewModel = function() {
    var meta = hyperdomMeta(this);
    meta.widgets.forEach(function (w) {
      self.rerenderWidget(w);
    });
  };

  var meta = hyperdomMeta(model);
  if (!meta.mount) {
    meta.mount = this;
  }

  if (!meta.widgets) {
    meta.widgets = new Set();
  }

  if (typeof model.onload == 'function') {
    if (!meta.loaded) {
      meta.loaded = true;
      hyperdom.refreshify(function () { return model.onload(); }, {refresh: 'promise'})();
    }
  }

  var vdom = model.render();

  if (vdom instanceof Array) {
    throw new Error('vdom returned from component cannot be an array');
  }

  if (vdom && vdom.properties) {
    vdom.properties._hyperdomViewModel = model;
  }

  return vdom;
}

Mount.prototype.renderViewModel = function(model) {
  if (typeof model.renderCacheKey === 'function') {
    var meta = hyperdomMeta(model);
    var key = model.renderCacheKey();
    if (key !== undefined && meta.cacheKey === key && meta.cachedVdom) {
      return meta.cachedVdom;
    } else {
      meta.cacheKey = key;
      return meta.cachedVdom = this._renderViewModel(model);
    }
  } else {
    return this._renderViewModel(model);
  }
};

Mount.prototype.detach = function () {
  this.mounted = false;
};

Mount.prototype.remove = function () {
  this.component.destroy({removeElement: true});
  this.mounted = false;
};

module.exports = Mount;

},{".":14,"./meta":16,"./runRender":20,"./set":21}],18:[function(require,module,exports){
var simplePromise = require('./simplePromise');

function Render(mount) {
  this.finished = simplePromise();
  this.mount = mount;
  this.attachment = mount;
}

module.exports = Render;

},{"./simplePromise":22}],19:[function(require,module,exports){
(function (global){
var h = require('./vhtml');
var domComponent = require('./domComponent');
var bindingMeta = require('./meta');
var toVdom = require('./toVdom');
var parseTag = require('virtual-dom/virtual-hyperscript/parse-tag');
var ViewModel = require('./viewModel');
var Mount = require('./mount');
var runRender = require('./runRender');
var deprecations = require('./deprecations');
var hyperdom = require('.');

function isViewModelOrComponent(component) {
  return component
    && ((typeof component.init === 'function'
       && typeof component.update === 'function'
       && typeof component.destroy === 'function') || (typeof component.renderViewModel === 'function'));
}

exports.merge = function (element, render, model, options) {
  var mount = startAttachment(render, model, options, function(mount, domComponentOptions) {
    var component = domComponent(domComponentOptions);
    var currentRender = hyperdom.currentRender;
    currentRender.eventHandlerWrapper = function() {
      return null;
    };
    var vdom = mount.render();
    component.merge(vdom, element);
    return component;
  });

  mount.rerender();

  return mount;
};

exports.append = function (element, render, model, options) {
  return startAttachment(render, model, options, function(mount, domComponentOptions) {
    var component = domComponent(domComponentOptions);
    var vdom = mount.render();
    element.appendChild(component.create(vdom));
    return component;
  });
};

exports.replace = function (element, render, model, options) {
  return startAttachment(render, model, options, function(mount, domComponentOptions) {
    var component = domComponent(domComponentOptions);
    var vdom = mount.render();
    element.parentNode.replaceChild(component.create(vdom), element);
    return component;
  });
};

exports.appendVDom = function (vdom, render, model, options) {
  return startAttachment(render, model, options, function(mount) {
    var component = {
      create: function(newVDom) {
        vdom.children = [];
        if (newVDom) {
          vdom.children.push(newVDom);
        }
      },
      update: function(newVDom) {
        vdom.children = [];
        if (newVDom) {
          vdom.children.push(newVDom);
        }
      }
    };
    component.create(mount.render());
    return component;
  });
};

exports.ViewModel = ViewModel;

function startAttachment(render, model, options, attachToDom) {
  if (typeof render == 'object' && typeof render.render == 'function') {
    return start(render, attachToDom, model);
  } else {
    deprecations.renderFunction('hyperdom.append and hyperdom.replace with render functions are deprecated, please pass a ViewModel');
    return start({render: function () { return render(model); }}, attachToDom, options);
  }
}

function start(model, attachToDom, options) {
  var mount = new Mount(model, options);
  runRender(mount, function () {
    if (options) {
      var domComponentOptions = {document: options.document};
    }
    mount.component = attachToDom(mount, domComponentOptions);
  });
  return mount;
}

var norefresh = {};

function norefreshFunction() {
  return norefresh;
}

function refreshify(fn, options) {
  if (!fn) {
    return fn;
  }

  var currentRender = hyperdom.currentRender();

  if (!currentRender) {
    if (typeof global === 'object') {
      return fn;
    } else {
      throw new Error('You cannot create virtual-dom event handlers outside a render function. See https://github.com/featurist/hyperdom#outside-render-cycle');
    }
  }

  var mount = currentRender.mount;
  var handleEventResult = exports.createEventResultHandler(mount, options);

  if (options && (options.norefresh == true || options.refresh == false)) {
    return fn;
  }

  return function () {
    var result = fn.apply(this, arguments);
    return handleEventResult(result);
  };
}

exports.createEventResultHandler = function(mount, options) {
  var onlyRefreshAfterPromise = options && options.refresh == 'promise';
  var viewModelToRefresh = options && options.viewModel;
  var componentToRefresh = options && options.component;

  function handleEventResult(result, promiseResult) {
    if (result && typeof(result.then) == 'function') {
      result.then(function (result) { handleEventResult(result, true); });
    }

    if (onlyRefreshAfterPromise && !promiseResult) {
      return;
    }

    if (isViewModelOrComponent(result)) {
      mount.rerenderWidget(result);
    } else if (result instanceof Array) {
      for (var i = 0; i < result.length; i++) {
        handleEventResult(result[i]);
      }
    } else if (viewModelToRefresh) {
      viewModelToRefresh.rerenderViewModel();
    } else if (componentToRefresh) {
      componentToRefresh.refresh();
    } else if (result === norefresh) {
      // don't refresh;
    } else if (result === norefreshFunction) {
      deprecations.norefresh('hyperdom.html.norefresh is deprecated, please use hyperdom.norefresh()');
      // don't refresh;
    } else {
      mount.rerender();
      return result;
    }
  }

  return handleEventResult;
};

function bindTextInput(attributes, children, get, set) {
  var textEventNames = ['onkeyup', 'oninput', 'onpaste', 'textInput'];

  var bindingValue = get();
  if (!(bindingValue instanceof Error)) {
    attributes.value = bindingValue != undefined? bindingValue: '';
  }

  attachEventHandler(attributes, textEventNames, function (ev) {
    if (bindingValue != ev.target.value) {
      set(ev.target.value);
    }
  });
}

function sequenceFunctions(handler1, handler2) {
  return function (ev) {
    handler1(ev);
    return handler2(ev);
  };
}

function insertEventHandler(attributes, eventName, handler) {
  var previousHandler = attributes[eventName];
  if (previousHandler) {
    attributes[eventName] = sequenceFunctions(handler, previousHandler);
  } else {
    attributes[eventName] = handler;
  }
}

function attachEventHandler(attributes, eventNames, handler) {
  if (eventNames instanceof Array) {
    for (var n = 0; n < eventNames.length; n++) {
      insertEventHandler(attributes, eventNames[n], handler);
    }
  } else {
    insertEventHandler(attributes, eventNames, handler);
  }
}

function ListenerHook(listener) {
  this.listener = exports.html.refreshify(listener);
}

ListenerHook.prototype.hook = function (element, propertyName) {
  element.addEventListener(propertyName.substring(2), this.listener, false);
};

ListenerHook.prototype.unhook = function (element, propertyName) {
  element.removeEventListener(propertyName.substring(2), this.listener);
};

function customEvent(name) {
  if (typeof Event == 'function') {
    return new Event(name);
  } else {
    var event = document.createEvent('Event');
    event.initEvent(name, false, false);
    return event;
  }
}

var inputTypeBindings = {
  text: bindTextInput,

  textarea: bindTextInput,

  checkbox: function (attributes, children, get, set) {
    attributes.checked = get();

    attachEventHandler(attributes, 'onclick', function (ev) {
      attributes.checked = ev.target.checked;
      set(ev.target.checked);
    });
  },

  radio: function (attributes, children, get, set) {
    var value = attributes.value;
    attributes.checked = get() == attributes.value;
    attributes.on_hyperdomsyncchecked = new ListenerHook(function (event) {
      attributes.checked = event.target.checked;
    });

    attachEventHandler(attributes, 'onclick', function (event) {
      var name = event.target.name;
      if (name) {
        var inputs = document.getElementsByName(name);
        for (var i = 0, l = inputs.length; i < l; i++) {
          inputs[i].dispatchEvent(customEvent('_hyperdomsyncchecked'));
        }
      }
      set(value);
    });
  },

  select: function (attributes, children, get, set) {
    var currentValue = get();

    var options = children.filter(function (child) {
      return child.tagName.toLowerCase() == 'option';
    });

    var values = [];
    var selectedIndex;

    for(var n = 0; n < options.length; n++) {
      var option = options[n];
      var hasValue = option.properties.hasOwnProperty('value');
      var value = option.properties.value;
      var text = option.children.map(function (x) { return x.text; }).join('');

      values.push(hasValue? value: text);

      var selected = value == currentValue || text == currentValue;

      if (selected) {
        selectedIndex = n;
      }

      option.properties.selected = selected;
      option.properties.value = n;
    }

    if (selectedIndex !== undefined) {
      attributes.selectedIndex = selectedIndex;
    }

    attachEventHandler(attributes, 'onchange', function (ev) {
      attributes.selectedIndex = ev.target.selectedIndex;
      set(values[ev.target.value]);
    });
  },

  file: function (attributes, children, get, set) {
    var multiple = attributes.multiple;

    attachEventHandler(attributes, 'onchange', function (ev) {
      if (multiple) {
        set(ev.target.files);
      } else {
        set(ev.target.files[0]);
      }
    });
  }
};

function bindModel(attributes, children, type) {
  var bind = inputTypeBindings[type] || bindTextInput;

  var bindingAttr = makeBinding(attributes.binding);
  bind(attributes, children, bindingAttr.get, bindingAttr.set);
}

function inputType(selector, attributes) {
  if (/^textarea\b/i.test(selector)) {
    return 'textarea';
  } else if (/^select\b/i.test(selector)) {
    return 'select';
  } else {
    return attributes.type || 'text';
  }
}

var renames = {
  for: 'htmlFor',
  class: 'className',
  contenteditable: 'contentEditable',
  tabindex: 'tabIndex',
  colspan: 'colSpan'
};

var dataAttributeRegex = /^data-/;

function prepareAttributes(tag, attributes, childElements) {
  var keys = Object.keys(attributes);
  var dataset;
  var currentRender = hyperdom.currentRender();
  var eventHandlerWrapper = currentRender && currentRender.eventHandlerWrapper;

  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    var attribute = attributes[key];

    if (typeof(attribute) == 'function') {
      if (eventHandlerWrapper) {
        var fn = eventHandlerWrapper.call(undefined, key.replace(/^on/, ''), attribute);
        attributes[key] = typeof fn === 'function'? refreshify(fn): fn;
      } else {
        attributes[key] = refreshify(attribute);
      }
    }

    var rename = renames[key];
    if (rename) {
      attributes[rename] = attribute;
      delete attributes[key];
      continue;
    }

    if (dataAttributeRegex.test(key)) {
      if (!dataset) {
        dataset = attributes.dataset;

        if (!dataset) {
          dataset = attributes.dataset = {};
        }
      }

      var datakey = key
        .replace(dataAttributeRegex, '')
        .replace(/-([a-z])/ig, function(_, x) { return x.toUpperCase(); });

      dataset[datakey] = attribute;
      delete attributes[key];
      continue;
    }
  }

  if (attributes.className) {
    attributes.className = generateClassName(attributes.className);
  }

  if (attributes.binding) {
    bindModel(attributes, childElements, inputType(tag, attributes));
    delete attributes.binding;
  }
}

/**
 * this function is quite ugly and you may be very tempted
 * to refactor it into smaller functions, I certainly am.
 * however, it was written like this for performance
 * so think of that before refactoring! :)
 */
exports.html = function (hierarchySelector) {
  var hasHierarchy = hierarchySelector.indexOf(' ') >= 0;
  var selector, selectorElements;

  if (hasHierarchy) {
    selectorElements = hierarchySelector.match(/\S+/g);
    selector = selectorElements[selectorElements.length - 1];
  } else {
    selector = hierarchySelector;
  }

  var childElements;
  var vdom;
  var tag;
  var attributes = arguments[1];

  if (attributes && attributes.constructor == Object && typeof attributes.render !== 'function') {
    childElements = toVdom.recursive(Array.prototype.slice.call(arguments, 2));
    prepareAttributes(selector, attributes, childElements);
    tag = parseTag(selector, attributes);
    vdom = h(tag, attributes, childElements);
  } else {
    attributes = {};
    childElements = toVdom.recursive(Array.prototype.slice.call(arguments, 1));
    tag = parseTag(selector, attributes);
    vdom = h(tag, attributes, childElements);
  }

  if (hasHierarchy) {
    for(var n = selectorElements.length - 2; n >= 0; n--) {
      vdom = h(selectorElements[n], {}, [vdom]);
    }
  }

  return vdom;
};

exports.jsx = function (tag, attributes) {
  var childElements = toVdom.recursive(Array.prototype.slice.call(arguments, 2));
  if (attributes) {
    prepareAttributes(tag, attributes, childElements);
  }
  return h(tag, attributes || {}, childElements);
};

Object.defineProperty(exports.html, 'currentRender', {get: function () {
  deprecations.currentRender('hyperdom.html.currentRender is deprecated, please use hyperdom.currentRender() instead');
  return exports.html._currentRender;
}});

Object.defineProperty(exports.html, 'refresh', {get: function () {
  deprecations.refresh('hyperdom.html.refresh is deprecated, please use viewModel.rerender() instead');
  return exports.html._refresh;
}});

function refreshAfter(promise) {
  deprecations.refreshAfter('hyperdom.html.refreshAfter is deprecated');
  var refresh = exports.html.refresh;

  promise.then(refresh);
}

exports.html.refreshify = refreshify;
exports.html.refreshAfter = refreshAfter;
exports.html.norefresh = norefresh;

function makeBinding(b, options) {
  var binding = b instanceof Array
    ?  bindingObject.apply(undefined, b)
    : b;

  binding.set = refreshify(binding.set, options);

  return binding;
}

function makeConverter(converter) {
  if (typeof converter == 'function') {
    return {
      view: function (model) {
        return model;
      },
      model: function (view) {
        return converter(view);
      }
    };
  } else {
    return converter;
  }
}

function chainConverters(startIndex, converters) {
  function makeConverters() {
    if (!_converters) {
      _converters = new Array(converters.length - startIndex);

      for(var n = startIndex; n < converters.length; n++) {
        _converters[n - startIndex] = makeConverter(converters[n]);
      }
    }
  }

  if ((converters.length - startIndex) == 1) {
    return makeConverter(converters[startIndex]);
  } else {
    var _converters;
    return {
      view: function (model) {
        makeConverters();
        var intermediateValue = model;
        for(var n = 0; n < _converters.length; n++) {
          intermediateValue = _converters[n].view(intermediateValue);
        }
        return intermediateValue;
      },

      model: function (view) {
        makeConverters();
        var intermediateValue = view;
        for(var n = _converters.length - 1; n >= 0; n--) {
          intermediateValue = _converters[n].model(intermediateValue);
        }
        return intermediateValue;
      }
    };
  }
}

function bindingObject(model, property) {
  var _meta;
  function hyperdomMeta() {
    return _meta || (_meta = bindingMeta(model, property));
  }

  if (arguments.length > 2) {
    var converter = chainConverters(2, arguments);

    return {
      get: function() {
        var meta = hyperdomMeta();
        var modelValue = model[property];
        var modelText;

        if (meta.error) {
          return meta.view;
        } else if (meta.view === undefined) {
          modelText = converter.view(modelValue);
          meta.view = modelText;
          return modelText;
        } else {
          var previousValue = converter.model(meta.view);
          modelText = converter.view(modelValue);
          var normalisedPreviousText = converter.view(previousValue);

          if (modelText === normalisedPreviousText) {
            return meta.view;
          } else {
            meta.view = modelText;
            return modelText;
          }
        }
      },

      set: function(view) {
        var meta = hyperdomMeta();
        meta.view = view;

        try {
          model[property] = converter.model(view, model[property]);
          delete meta.error;
        } catch (e) {
          meta.error = e;
        }
      },

      meta: function() {
        return hyperdomMeta();
      }
    };
  } else {
    return {
      get: function () {
        return model[property];
      },

      set: function (value) {
        model[property] = value;
      },

      meta: function() {
        return hyperdomMeta();
      }
    };
  }
}

exports.binding = makeBinding;
exports.html.binding = makeBinding;
exports.html.meta = bindingMeta;

function rawHtml() {
  var selector;
  var html;
  var options;

  if (arguments.length == 2) {
    selector = arguments[0];
    html = arguments[1];
    options = {innerHTML: html};
    return exports.html(selector, options);
  } else {
    selector = arguments[0];
    options = arguments[1];
    html = arguments[2];
    options.innerHTML = html;
    return exports.html(selector, options);
  }
}

exports.html.rawHtml = rawHtml;


function generateConditionalClassNames(obj) {
  return Object.keys(obj).filter(function (key) {
    return obj[key];
  }).join(' ') || undefined;
}

function generateClassName(obj) {
  if (typeof(obj) == 'object') {
    if (obj instanceof Array) {
      var names = obj.map(function(item) {
        return generateClassName(item);
      });
      return names.join(' ') || undefined;
    } else {
      return generateConditionalClassNames(obj);
    }
  } else {
    return obj;
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{".":14,"./deprecations":12,"./domComponent":13,"./meta":16,"./mount":17,"./runRender":20,"./toVdom":23,"./vhtml":24,"./viewModel":25,"virtual-dom/virtual-hyperscript/parse-tag":40}],20:[function(require,module,exports){
var hyperdom = require('.');
var Render = require('./render');
var rendering = require('./rendering');

function refreshOutOfRender() {
  throw new Error('Please assign hyperdom.html.refresh during a render cycle if you want to use it in event handlers. See https://github.com/featurist/hyperdom#refresh-outside-render-cycle');
}

module.exports = function(mount, fn) {
  var render = new Render(mount);

  try {
    hyperdom._currentRender = render;

    rendering.html._currentRender = render;
    rendering.html._refresh = rendering.createEventResultHandler(mount);

    fn();
  } finally {
    render.finished.fulfill();
    hyperdom._currentRender = undefined;

    rendering.html._refresh = refreshOutOfRender;
    rendering.html._currentRender = undefined;
  }
};

},{".":14,"./render":18,"./rendering":19}],21:[function(require,module,exports){
if (typeof Set === 'function') {
  module.exports = Set;
} else {
  module.exports = function() {
    this.items = [];
  };

  module.exports.prototype.add = function(widget) {
    if (this.items.indexOf(widget) == -1) {
      this.items.push(widget);
    }
  };

  module.exports.prototype.delete = function(widget) {
    var i = this.items.indexOf(widget);
    if (i !== -1) {
      this.items.splice(i, 1);
    }
  };

  module.exports.prototype.forEach = function(fn) {
    for(var n = 0; n < this.items.length; n++) {
      fn(this.items[n]);
    }
  };
}

},{}],22:[function(require,module,exports){
function SimplePromise () {
  this.listeners = [];
}

SimplePromise.prototype.fulfill = function (value) {
  if (!this.isFulfilled) {
    this.isFulfilled = true;
    this.value = value;
    this.listeners.forEach(function (listener) {
      listener();
    });
  }
};

SimplePromise.prototype.then = function (success) {
  if (this.isFulfilled) {
    var self = this;
    setTimeout(function () {
      success(self.value);
    });
  } else {
    this.listeners.push(success);
  }
};

module.exports = function () {
  return new SimplePromise();
};

},{}],23:[function(require,module,exports){
var vtext = require("virtual-dom/vnode/vtext.js")
var rendering = require('./rendering');
var isVdom = require('./isVdom');

function toVdom(object) {
  if (object === undefined || object === null) {
    return new vtext('');
  } else if (typeof(object) != 'object') {
    return new vtext(String(object));
  } else if (object instanceof Date) {
    return new vtext(String(object));
  } else if (object instanceof Error) {
    return new vtext(object.toString());
  } else if (isVdom(object)) {
    return object;
  } else if (typeof object.render === 'function') {
    return new rendering.ViewModel(object);
  } else {
    return new vtext(JSON.stringify(object));
  }
}

module.exports = toVdom;

function addChild(children, child) {
  if (child instanceof Array) {
    for (var n = 0; n < child.length; n++) {
      addChild(children, child[n]);
    }
  } else {
    children.push(toVdom(child));
  }
}

module.exports.recursive = function (child) {
  var children = [];
  addChild(children, child);
  return children;
};

},{"./isVdom":15,"./rendering":19,"virtual-dom/vnode/vtext.js":50}],24:[function(require,module,exports){
'use strict';

var VNode = require('virtual-dom/vnode/vnode.js');
var isHook = require('virtual-dom/vnode/is-vhook');

var softSetHook = require('virtual-dom/virtual-hyperscript/hooks/soft-set-hook.js');

module.exports = h;

function h(tagName, props, children) {
  var tag = tagName;

  // support keys
  if (props.hasOwnProperty('key')) {
    var key = props.key;
    props.key = undefined;
  }

  // support namespace
  if (props.hasOwnProperty('namespace')) {
    var namespace = props.namespace;
    props.namespace = undefined;
  }

  // fix cursor bug
  if (tag.toLowerCase() === 'input' &&
    !namespace &&
    props.hasOwnProperty('value') &&
    props.value !== undefined &&
    !isHook(props.value)
  ) {
    props.value = softSetHook(props.value);
  }

  return new VNode(tag, props, children, key, namespace);
}

},{"virtual-dom/virtual-hyperscript/hooks/soft-set-hook.js":39,"virtual-dom/vnode/is-vhook":43,"virtual-dom/vnode/vnode.js":48}],25:[function(require,module,exports){
var domComponent = require('./domComponent');
var hyperdomMeta = require('./meta');
var hyperdom = require('.');

function ViewModel(model) {
  var currentRender = hyperdom.currentRender();

  this.currentRender = currentRender;
  this.model = model;
  this.key = model.renderKey;
  this.component = undefined;
  this.mount = currentRender.mount;
}

ViewModel.prototype.type = 'Widget';

ViewModel.prototype.init = function () {
  var self = this;

  var vdom = this.render();

  var meta = hyperdomMeta(this.model);
  meta.widgets.add(this);

  this.component = domComponent();
  var element = this.component.create(vdom);

  if (self.model.onadd) {
    this.currentRender.finished.then(function () {
      self.model.onadd(element);
    });
  }

  if (self.model.detached) {
    return document.createTextNode('');
  } else {
    return element;
  }
};

ViewModel.prototype.update = function (previous) {
  var self = this;

  if (self.model.onupdate) {
    this.currentRender.finished.then(function () {
      self.model.onupdate(self.component.element);
    });
  }

  this.component = previous.component;

  var element = this.component.update(this.render());

  if (self.model.detached) {
    return document.createTextNode('');
  } else {
    return element;
  }
};

ViewModel.prototype.render = function () {
  return this.mount.renderViewModel(this.model);
};

ViewModel.prototype.rerender = function () {
  this.component.update(this.render());
  if (this.model.onupdate) {
    this.model.onupdate(this.component.element);
  }
};

ViewModel.prototype.destroy = function (element) {
  var self = this;

  var meta = hyperdomMeta(this.model);
  meta.widgets.delete(this);

  if (self.model.onremove) {
    this.currentRender.finished.then(function () {
      self.model.onremove(element);
    });
  }

  this.component.destroy();
};

module.exports = ViewModel;

},{".":14,"./domComponent":13,"./meta":16}],26:[function(require,module,exports){
var domComponent = require('./domComponent');
var rendering = require('./rendering');
var VText = require("virtual-dom/vnode/vtext.js")

function WindowWidget(attributes) {
  this.attributes = attributes;
  this.vdom = new VText('');
  this.component = domComponent();

  var self = this;
  this.cache = {};
  Object.keys(this.attributes).forEach(function (key) {
    self.cache[key] = rendering.html.refreshify(self.attributes[key]);
  });
}

WindowWidget.prototype.type = 'Widget';

WindowWidget.prototype.init = function () {
  applyPropertyDiffs(window, {}, this.attributes, {}, this.cache);
  return this.element = document.createTextNode('');
};

function uniq(array) {
  var sortedArray = array.slice();
  sortedArray.sort();

  var last;

  for(var n = 0; n < sortedArray.length;) {
    var current = sortedArray[n];

    if (last === current) {
      sortedArray.splice(n, 1);
    } else {
      n++;
    }
    last = current;
  }

  return sortedArray;
}

function applyPropertyDiffs(element, previous, current, previousCache, currentCache) {
  uniq(Object.keys(previous).concat(Object.keys(current))).forEach(function (key) {
    if (/^on/.test(key)) {
      var event = key.slice(2);

      var prev = previous[key];
      var curr = current[key];
      var refreshPrev = previousCache[key];
      var refreshCurr = currentCache[key];

      if (prev !== undefined && curr === undefined) {
        element.removeEventListener(event, refreshPrev);
      } else if (prev !== undefined && curr !== undefined && prev !== curr) {
        element.removeEventListener(event, refreshPrev);
        element.addEventListener(event, refreshCurr);
      } else if (prev === undefined && curr !== undefined) {
        element.addEventListener(event, refreshCurr);
      }
    }
  });
}

WindowWidget.prototype.update = function (previous) {
  applyPropertyDiffs(window, previous.attributes, this.attributes, previous.cache, this.cache);
  this.component = previous.component;
  return this.element;
};

WindowWidget.prototype.destroy = function () {
  applyPropertyDiffs(window, this.attributes, {}, this.cache, {});
};

module.exports = function (attributes) {
  return new WindowWidget(attributes);
};

},{"./domComponent":13,"./rendering":19,"virtual-dom/vnode/vtext.js":50}],27:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],28:[function(require,module,exports){
/*!
 * Unidragger v1.1.5
 * Draggable base class
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
  /*global define: false, module: false, require: false */
  'use strict';
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'eventie/eventie',
      'unipointer/unipointer'
    ], function( eventie, Unipointer ) {
      return factory( window, eventie, Unipointer );
    });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('eventie'),
      require('unipointer')
    );
  } else {
    // browser global
    window.Unidragger = factory(
      window,
      window.eventie,
      window.Unipointer
    );
  }

}( window, function factory( window, eventie, Unipointer ) {

'use strict';

// -----  ----- //

function noop() {}

// handle IE8 prevent default
function preventDefaultEvent( event ) {
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

// -------------------------- Unidragger -------------------------- //

function Unidragger() {}

// inherit Unipointer & EventEmitter
Unidragger.prototype = new Unipointer();

// ----- bind start ----- //

Unidragger.prototype.bindHandles = function() {
  this._bindHandles( true );
};

Unidragger.prototype.unbindHandles = function() {
  this._bindHandles( false );
};

var navigator = window.navigator;
/**
 * works as unbinder, as you can .bindHandles( false ) to unbind
 * @param {Boolean} isBind - will unbind if falsey
 */
Unidragger.prototype._bindHandles = function( isBind ) {
  // munge isBind, default to true
  isBind = isBind === undefined ? true : !!isBind;
  // extra bind logic
  var binderExtra;
  if ( navigator.pointerEnabled ) {
    binderExtra = function( handle ) {
      // disable scrolling on the element
      handle.style.touchAction = isBind ? 'none' : '';
    };
  } else if ( navigator.msPointerEnabled ) {
    binderExtra = function( handle ) {
      // disable scrolling on the element
      handle.style.msTouchAction = isBind ? 'none' : '';
    };
  } else {
    binderExtra = function() {
      // TODO re-enable img.ondragstart when unbinding
      if ( isBind ) {
        disableImgOndragstart( handle );
      }
    };
  }
  // bind each handle
  var bindMethod = isBind ? 'bind' : 'unbind';
  for ( var i=0, len = this.handles.length; i < len; i++ ) {
    var handle = this.handles[i];
    this._bindStartEvent( handle, isBind );
    binderExtra( handle );
    eventie[ bindMethod ]( handle, 'click', this );
  }
};

// remove default dragging interaction on all images in IE8
// IE8 does its own drag thing on images, which messes stuff up

function noDragStart() {
  return false;
}

// TODO replace this with a IE8 test
var isIE8 = 'attachEvent' in document.documentElement;

// IE8 only
var disableImgOndragstart = !isIE8 ? noop : function( handle ) {

  if ( handle.nodeName == 'IMG' ) {
    handle.ondragstart = noDragStart;
  }

  var images = handle.querySelectorAll('img');
  for ( var i=0, len = images.length; i < len; i++ ) {
    var img = images[i];
    img.ondragstart = noDragStart;
  }
};

// ----- start event ----- //

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Unidragger.prototype.pointerDown = function( event, pointer ) {
  // dismiss range sliders
  if ( event.target.nodeName == 'INPUT' && event.target.type == 'range' ) {
    // reset pointerDown logic
    this.isPointerDown = false;
    delete this.pointerIdentifier;
    return;
  }

  this._dragPointerDown( event, pointer );
  // kludge to blur focused inputs in dragger
  var focused = document.activeElement;
  if ( focused && focused.blur ) {
    focused.blur();
  }
  // bind move and end events
  this._bindPostStartEvents( event );
  // track scrolling
  this.pointerDownScroll = Unidragger.getScrollPosition();
  eventie.bind( window, 'scroll', this );

  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// base pointer down logic
Unidragger.prototype._dragPointerDown = function( event, pointer ) {
  // track to see when dragging starts
  this.pointerDownPoint = Unipointer.getPointerPoint( pointer );

  // prevent default, unless touchstart or <select>
  var isTouchstart = event.type == 'touchstart';
  var targetNodeName = event.target.nodeName;
  if ( !isTouchstart && targetNodeName != 'SELECT' ) {
    preventDefaultEvent( event );
  }
};

// ----- move event ----- //

/**
 * drag move
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Unidragger.prototype.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

// base pointer move logic
Unidragger.prototype._dragPointerMove = function( event, pointer ) {
  var movePoint = Unipointer.getPointerPoint( pointer );
  var moveVector = {
    x: movePoint.x - this.pointerDownPoint.x,
    y: movePoint.y - this.pointerDownPoint.y
  };
  // start drag if pointer has moved far enough to start drag
  if ( !this.isDragging && this.hasDragStarted( moveVector ) ) {
    this._dragStart( event, pointer );
  }
  return moveVector;
};

// condition if pointer has moved far enough to start drag
Unidragger.prototype.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
};


// ----- end event ----- //

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Unidragger.prototype.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
  this._dragPointerUp( event, pointer );
};

Unidragger.prototype._dragPointerUp = function( event, pointer ) {
  if ( this.isDragging ) {
    this._dragEnd( event, pointer );
  } else {
    // pointer didn't move enough for drag to start
    this._staticClick( event, pointer );
  }
};

Unipointer.prototype.pointerDone = function() {
  eventie.unbind( window, 'scroll', this );
};

// -------------------------- drag -------------------------- //

// dragStart
Unidragger.prototype._dragStart = function( event, pointer ) {
  this.isDragging = true;
  this.dragStartPoint = Unidragger.getPointerPoint( pointer );
  // prevent clicks
  this.isPreventingClicks = true;

  this.dragStart( event, pointer );
};

Unidragger.prototype.dragStart = function( event, pointer ) {
  this.emitEvent( 'dragStart', [ event, pointer ] );
};

// dragMove
Unidragger.prototype._dragMove = function( event, pointer, moveVector ) {
  // do not drag if not dragging yet
  if ( !this.isDragging ) {
    return;
  }

  this.dragMove( event, pointer, moveVector );
};

Unidragger.prototype.dragMove = function( event, pointer, moveVector ) {
  preventDefaultEvent( event );
  this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
};

// dragEnd
Unidragger.prototype._dragEnd = function( event, pointer ) {
  // set flags
  this.isDragging = false;
  // re-enable clicking async
  var _this = this;
  setTimeout( function() {
    delete _this.isPreventingClicks;
  });

  this.dragEnd( event, pointer );
};

Unidragger.prototype.dragEnd = function( event, pointer ) {
  this.emitEvent( 'dragEnd', [ event, pointer ] );
};

Unidragger.prototype.pointerDone = function() {
  eventie.unbind( window, 'scroll', this );
  delete this.pointerDownScroll;
};

// ----- onclick ----- //

// handle all clicks and prevent clicks when dragging
Unidragger.prototype.onclick = function( event ) {
  if ( this.isPreventingClicks ) {
    preventDefaultEvent( event );
  }
};

// ----- staticClick ----- //

// triggered after pointer down & up with no/tiny movement
Unidragger.prototype._staticClick = function( event, pointer ) {
  // ignore emulated mouse up clicks
  if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
    return;
  }

  // allow click in <input>s and <textarea>s
  var nodeName = event.target.nodeName;
  if ( nodeName == 'INPUT' || nodeName == 'TEXTAREA' ) {
    event.target.focus();
  }
  this.staticClick( event, pointer );

  // set flag for emulated clicks 300ms after touchend
  if ( event.type != 'mouseup' ) {
    this.isIgnoringMouseUp = true;
    var _this = this;
    // reset flag after 300ms
    setTimeout( function() {
      delete _this.isIgnoringMouseUp;
    }, 400 );
  }
};

Unidragger.prototype.staticClick = function( event, pointer ) {
  this.emitEvent( 'staticClick', [ event, pointer ] );
};

// ----- scroll ----- //

Unidragger.prototype.onscroll = function() {
  var scroll = Unidragger.getScrollPosition();
  var scrollMoveX = this.pointerDownScroll.x - scroll.x;
  var scrollMoveY = this.pointerDownScroll.y - scroll.y;
  // cancel click/tap if scroll is too much
  if ( Math.abs( scrollMoveX ) > 3 || Math.abs( scrollMoveY ) > 3 ) {
    this._pointerDone();
  }
};

// ----- utils ----- //

Unidragger.getPointerPoint = function( pointer ) {
  return {
    x: pointer.pageX !== undefined ? pointer.pageX : pointer.clientX,
    y: pointer.pageY !== undefined ? pointer.pageY : pointer.clientY
  };
};

var isPageOffset = window.pageYOffset !== undefined;

// get scroll in { x, y }
Unidragger.getScrollPosition = function() {
  return {
    x: isPageOffset ? window.pageXOffset : document.body.scrollLeft,
    y: isPageOffset ? window.pageYOffset : document.body.scrollTop
  };
};

// -----  ----- //

Unidragger.getPointerPoint = Unipointer.getPointerPoint;

return Unidragger;

}));

},{"eventie":8,"unipointer":29}],29:[function(require,module,exports){
/*!
 * Unipointer v1.1.0
 * base class for doing one thing with pointer event
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */
/*global define: false, module: false, require: false */

( function( window, factory ) {
  'use strict';
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'eventEmitter/EventEmitter',
      'eventie/eventie'
    ], function( EventEmitter, eventie ) {
      return factory( window, EventEmitter, eventie );
    });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.Unipointer = factory(
      window,
      window.EventEmitter,
      window.eventie
    );
  }

}( window, function factory( window, EventEmitter, eventie ) {

'use strict';

function noop() {}

function Unipointer() {}

// inherit EventEmitter
Unipointer.prototype = new EventEmitter();

Unipointer.prototype.bindStartEvent = function( elem ) {
  this._bindStartEvent( elem, true );
};

Unipointer.prototype.unbindStartEvent = function( elem ) {
  this._bindStartEvent( elem, false );
};

/**
 * works as unbinder, as you can ._bindStart( false ) to unbind
 * @param {Boolean} isBind - will unbind if falsey
 */
Unipointer.prototype._bindStartEvent = function( elem, isBind ) {
  // munge isBind, default to true
  isBind = isBind === undefined ? true : !!isBind;
  var bindMethod = isBind ? 'bind' : 'unbind';

  if ( window.navigator.pointerEnabled ) {
    // W3C Pointer Events, IE11. See https://coderwall.com/p/mfreca
    eventie[ bindMethod ]( elem, 'pointerdown', this );
  } else if ( window.navigator.msPointerEnabled ) {
    // IE10 Pointer Events
    eventie[ bindMethod ]( elem, 'MSPointerDown', this );
  } else {
    // listen for both, for devices like Chrome Pixel
    eventie[ bindMethod ]( elem, 'mousedown', this );
    eventie[ bindMethod ]( elem, 'touchstart', this );
  }
};

// trigger handler methods for events
Unipointer.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// returns the touch that we're keeping track of
Unipointer.prototype.getTouch = function( touches ) {
  for ( var i=0, len = touches.length; i < len; i++ ) {
    var touch = touches[i];
    if ( touch.identifier == this.pointerIdentifier ) {
      return touch;
    }
  }
};

// ----- start event ----- //

Unipointer.prototype.onmousedown = function( event ) {
  // dismiss clicks from right or middle buttons
  var button = event.button;
  if ( button && ( button !== 0 && button !== 1 ) ) {
    return;
  }
  this._pointerDown( event, event );
};

Unipointer.prototype.ontouchstart = function( event ) {
  this._pointerDown( event, event.changedTouches[0] );
};

Unipointer.prototype.onMSPointerDown =
Unipointer.prototype.onpointerdown = function( event ) {
  this._pointerDown( event, event );
};

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Unipointer.prototype._pointerDown = function( event, pointer ) {
  // dismiss other pointers
  if ( this.isPointerDown ) {
    return;
  }

  this.isPointerDown = true;
  // save pointer identifier to match up touch events
  this.pointerIdentifier = pointer.pointerId !== undefined ?
    // pointerId for pointer events, touch.indentifier for touch events
    pointer.pointerId : pointer.identifier;

  this.pointerDown( event, pointer );
};

Unipointer.prototype.pointerDown = function( event, pointer ) {
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// hash of events to be bound after start event
var postStartEvents = {
  mousedown: [ 'mousemove', 'mouseup' ],
  touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
  pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
  MSPointerDown: [ 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel' ]
};

Unipointer.prototype._bindPostStartEvents = function( event ) {
  if ( !event ) {
    return;
  }
  // get proper events to match start event
  var events = postStartEvents[ event.type ];
  // IE8 needs to be bound to document
  var node = event.preventDefault ? window : document;
  // bind events to node
  for ( var i=0, len = events.length; i < len; i++ ) {
    var evnt = events[i];
    eventie.bind( node, evnt, this );
  }
  // save these arguments
  this._boundPointerEvents = {
    events: events,
    node: node
  };
};

Unipointer.prototype._unbindPostStartEvents = function() {
  var args = this._boundPointerEvents;
  // IE8 can trigger dragEnd twice, check for _boundEvents
  if ( !args || !args.events ) {
    return;
  }

  for ( var i=0, len = args.events.length; i < len; i++ ) {
    var event = args.events[i];
    eventie.unbind( args.node, event, this );
  }
  delete this._boundPointerEvents;
};

// ----- move event ----- //

Unipointer.prototype.onmousemove = function( event ) {
  this._pointerMove( event, event );
};

Unipointer.prototype.onMSPointerMove =
Unipointer.prototype.onpointermove = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerMove( event, event );
  }
};

Unipointer.prototype.ontouchmove = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerMove( event, touch );
  }
};

/**
 * pointer move
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
Unipointer.prototype._pointerMove = function( event, pointer ) {
  this.pointerMove( event, pointer );
};

// public
Unipointer.prototype.pointerMove = function( event, pointer ) {
  this.emitEvent( 'pointerMove', [ event, pointer ] );
};

// ----- end event ----- //


Unipointer.prototype.onmouseup = function( event ) {
  this._pointerUp( event, event );
};

Unipointer.prototype.onMSPointerUp =
Unipointer.prototype.onpointerup = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerUp( event, event );
  }
};

Unipointer.prototype.ontouchend = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerUp( event, touch );
  }
};

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
Unipointer.prototype._pointerUp = function( event, pointer ) {
  this._pointerDone();
  this.pointerUp( event, pointer );
};

// public
Unipointer.prototype.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
};

// ----- pointer done ----- //

// triggered on pointer up & pointer cancel
Unipointer.prototype._pointerDone = function() {
  // reset properties
  this.isPointerDown = false;
  delete this.pointerIdentifier;
  // remove events
  this._unbindPostStartEvents();
  this.pointerDone();
};

Unipointer.prototype.pointerDone = noop;

// ----- pointer cancel ----- //

Unipointer.prototype.onMSPointerCancel =
Unipointer.prototype.onpointercancel = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerCancel( event, event );
  }
};

Unipointer.prototype.ontouchcancel = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerCancel( event, touch );
  }
};

/**
 * pointer cancel
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
Unipointer.prototype._pointerCancel = function( event, pointer ) {
  this._pointerDone();
  this.pointerCancel( event, pointer );
};

// public
Unipointer.prototype.pointerCancel = function( event, pointer ) {
  this.emitEvent( 'pointerCancel', [ event, pointer ] );
};

// -----  ----- //

// utility function for getting x/y cooridinates from event, because IE8
Unipointer.getPointerPoint = function( pointer ) {
  return {
    x: pointer.pageX !== undefined ? pointer.pageX : pointer.clientX,
    y: pointer.pageY !== undefined ? pointer.pageY : pointer.clientY
  };
};

// -----  ----- //

return Unipointer;

}));

},{"eventie":8,"wolfy87-eventemitter":53}],30:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":34}],31:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":52}],32:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":37}],33:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":43,"is-object":27}],34:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":41,"../vnode/is-vnode.js":44,"../vnode/is-vtext.js":45,"../vnode/is-widget.js":46,"./apply-properties":33,"global/document":10}],35:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],36:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":46,"../vnode/vpatch.js":49,"./apply-properties":33,"./update-widget":38}],37:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":34,"./dom-index":35,"./patch-op":36,"global/document":10,"x-is-array":54}],38:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":46}],39:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],40:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":4}],41:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":42,"./is-vnode":44,"./is-vtext":45,"./is-widget":46}],42:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],43:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],44:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":47}],45:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":47}],46:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],47:[function(require,module,exports){
module.exports = "2"

},{}],48:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":42,"./is-vhook":43,"./is-vnode":44,"./is-widget":46,"./version":47}],49:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":47}],50:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":47}],51:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":43,"is-object":27}],52:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":41,"../vnode/is-thunk":42,"../vnode/is-vnode":44,"../vnode/is-vtext":45,"../vnode/is-widget":46,"../vnode/vpatch":49,"./diff-props":51,"x-is-array":54}],53:[function(require,module,exports){
/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));

},{}],54:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}]},{},[1]);
