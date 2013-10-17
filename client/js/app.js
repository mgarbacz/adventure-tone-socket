(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("client/client", function(exports, require, module) {
var col, grid, grid_box, grid_row, row, socket, toggleGrid, _i, _j;

grid = document.getElementById('grid');

for (row = _i = 0; _i <= 15; row = ++_i) {
  grid_row = document.createElement('div');
  grid_row.id = 'grid-row-' + row;
  for (col = _j = 0; _j <= 15; col = ++_j) {
    grid_box = document.createElement('div');
    grid_box.className = 'grid-box';
    grid_box.id = 'grid-row-' + row + '-col-' + col;
    grid_row.appendChild(grid_box);
  }
  grid.appendChild(grid_row);
}

toggleGrid = function(target_id, sender) {
  var proper_class, target;
  proper_class = 'grid-box ' + sender + '-clicked';
  target = document.getElementById(target_id);
  if (target.className === 'grid-box') {
    return target.className = proper_class;
  } else if (target.className === proper_class) {
    return target.className = 'grid-box';
  } else if (sender === 'client') {
    if (target.className === 'grid-box other-clicked client-clicked') {
      return target.className = 'grid-box other-clicked';
    } else if (target.className === 'grid-box other-clicked') {
      return target.className = 'grid-box other-clicked client-clicked';
    } else {
      return target.className = 'grid-box client-clicked';
    }
  } else if (sender === 'other') {
    if (target.className === 'grid-box client-clicked') {
      return target.className = 'grid-box other-clicked client-clicked';
    } else if (target.className === 'grid-box other-clicked client-clicked') {
      return target.className = 'grid-box client-clicked';
    } else {
      return target.className = 'grid-box other-clicked';
    }
  }
};

grid.addEventListener('click', function(e) {
  socket.emit('grid click', {
    element: e.toElement.id,
    sender: 'other'
  });
  return toggleGrid(e.toElement.id, 'client');
});

socket = io.connect('//localhost:8888/tones');

socket.on('connect', function() {
  socket.on('greeting', function(data) {
    return console.log(data);
  });
  socket.emit('greeting', {
    greeting: 'Hi server!'
  });
  socket.on('grid status', function(data) {
    var click, _k, _len, _ref, _results;
    _ref = data.clicks;
    _results = [];
    for (_k = 0, _len = _ref.length; _k < _len; _k++) {
      click = _ref[_k];
      _results.push(toggleGrid(click.element, click.sender));
    }
    return _results;
  });
  return socket.on('grid click', function(data) {
    return toggleGrid(data.element, data.sender);
  });
});

});

;