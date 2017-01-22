'use strict';
var View = require('ampersand-view');
// var throttle = require('lodash.throttle');
require('./../EventListenerOptions.polyfill');

function noop() {}

function splitClean(str) {
  return str.split(' ')
            .map(p => p.trim())
            .filter(p => p);
}

var ControlView = View.extend({
  _commandsBound: false,

  initialize: function() {
    View.prototype.initialize.apply(this, arguments);
    var view = this;

    function initCommands() {
      // console.info('initCommands', view.cid, !!view.el, view._commandsBound, view.el && !view._commandsBound ? 'bind' : view.el && view._commandsBound ? 'unbind' : 'skip');
      if (view.el) {
        view.bindCommands();
      }
      else if (view.el) {
        view.unbindCommands();
      }
    }

    view.on('change:el', initCommands);
    initCommands();
  },

  derived:{
    rootView:{
      deps:['parent'],
      fn: function() {
        for (var inst = this; inst; inst = inst.parent) {
          if (!inst.parent) { return inst; }
        }
      }
    }
  },

  sendCommand: function(...args) {
    console.info('controlView sendCommand', ...args);
    this.rootView.sendCommand(...args);
  },

  _commands: function(el) {
    var view = this;
    var commands = [];
    var rootView = view.rootView;
    el = el || view.el;
    // not sure about that...
    if (!el) return commands;


    Object.keys(view.commands || {}).forEach(function(key) {

      var evtNameSelctor = splitClean(key);
      var info = view.commands[key];
      var serializer = noop;
      var command;

      if (typeof info === 'string') {
        var cmdNameMethodName = splitClean(info);
        command = cmdNameMethodName[0];

        if (cmdNameMethodName[1]) {
          serializer = view[cmdNameMethodName[1]];

          if (typeof serializer !== 'function') {
            throw new Error('Command "' + info + '" method not found');
          }
        }

        info = {};
      }
      else {
        command = info.command;
        serializer = info.serializer;
      }

      // var listener = throttle(function commandEventListener(...args) {
      //   rootView.sendCommand(command, serializer(...args)/*, done*/);
      // }, 1000 / 24);
      var listener = function commandEventListener(...args) {
        console.info(...args);
        rootView.sendCommand(command, serializer.apply(view, ...args)/*, done*/);
      };

      var els = [view.el];
      if (evtNameSelctor[1]) {
        els = el.querySelectorAll(evtNameSelctor[1]);
      }

      commands.push({
        event: evtNameSelctor[0],
        listener: listener,
        command: command,
        listenerOptions: {
          passive: info.passive
        },
        elements: els
      });
    }, view);
    // console.info('commands', view.cid, view.el, commands);
    return commands;
  },

  bindCommands: function(el) {
    if (this._commandsBound) return this;
    this._commands(el).forEach(function(info) {
      for (var e = 0; e < info.elements.length; e++) {
        info.elements[e].addEventListener(info.event, info.listener, info.listenerOptions);
      }
    });
    this._commandsBound = true;
    this.trigger('commands:bound');
    return this;
  },

  unbindCommands: function(el) {
    if (!this._commandsBound) return this;
    this._commands(el).forEach(function(info) {
      for (var e = 0; e < info.elements.length; e++) {
        //? if (info.elements[e].removeEventListener)
        info.elements[e].removeEventListener(info.event, info.listener, info.listenerOptions);
      }
    });
    this._commandsBound = false;
    this.trigger('commands:unbound');
    return this;
  },

  remove: function() {
    this.unbindCommands();
    return View.prototype.remove.apply(this, arguments);
  }
});

module.exports = ControlView;