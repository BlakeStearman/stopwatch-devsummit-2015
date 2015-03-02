define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom",
  "dojo/dom-attr",
  "dojo/on",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/Stopwatch.html"
], function(declare, lang, dom, domAttr, on, _WidgetBase, _TemplatedMixin, template) {
  return declare([_WidgetBase, _TemplatedMixin], {
    declaredClass: "widgets.Stopwatch",
    baseClass: "Stopwatch",
    templateString: template,

    _displayInterval: null,
    _startTime: 0,
    _stopTime: 0,
    _running: false,

    // ctor options
    updateInterval: 25, // time in ms

    constructor: function(options) {
      this.inherited(arguments);

      this.updateInterval = options.updateInterval || 25;
    },

    postCreate: function() {
      this.inherited(arguments);

      // connect button handlers
      this.own(
        on(this._startButton, "click", lang.hitch(this, this._onStart)),
        on(this._stopButton, "click", lang.hitch(this, this._onStop))
      );
    },

    isRunning: function() {
      return this._running;
    },

    reset: function() {
      this._startTime = 0;
      this._stopTime = 0;
    },

    start: function() {
      if(!this.isRunning()) {
        this._running = true;

        if(this._startTime === 0) {
          this._startTime = Date.now();
        }
      }
    },

    stop: function() {
      if(this.isRunning()) {
        this._running = false;
        this._stopTime = Date.now();
      }
    },

    displayTime: function() {
      var totalTime = this._time() || 0,
          milliseconds = parseInt(totalTime % 1000),
          seconds = parseInt(((totalTime - milliseconds) / 1000) % 60),
          minutes = parseInt(((((totalTime - milliseconds) / 1000) - seconds) / 60) % 60),
          hours = parseInt(((((((totalTime - milliseconds) / 1000) - seconds) / 60) - minutes) / 60) % 24);
      return this._padWithZeros(hours, 2) + ":" +
             this._padWithZeros(minutes, 2) + ":" +
             this._padWithZeros(seconds, 2) + ":" +
             this._padWithZeros(milliseconds, 3);
    },

    _time: function() {
      var finalTime = this.isRunning() ? Date.now() : this._stopTime;
      return finalTime - this._startTime;
    },

    _updateDisplay: function() {
      domAttr.set(this._displayNode, "innerHTML", this.displayTime());
    },

    _padWithZeros: function(number, upTo) {
      var numberText = number.toString(),
          totalChars = numberText.length,
          zerosNeeded;

      if(totalChars >= upTo) {
        return numberText;
      }

      zerosNeeded = upTo - totalChars;

      for(var i = 0; i < zerosNeeded; i++) {
        numberText = "0" + numberText;
      }

      return numberText;
    },

    _onStart: function() {
      this.start();
      if(!this._displayInterval) {
        this._displayInterval = setInterval(lang.hitch(this, this._updateDisplay), this.updateInterval);
      }
    },

    _onStop: function() {
      if(this.isRunning()) {
        this.stop();
      } else {
        this.reset();
        if(this._displayInterval) {
          clearInterval(this._displayInterval);
          this._displayInterval = null;
        }
        this._updateDisplay();
      }
    }
  });
});