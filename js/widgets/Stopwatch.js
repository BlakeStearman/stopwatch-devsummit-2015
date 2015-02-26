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

    displayInterval: null,
    startTime: null,
    stopTime: null,
    totalTime: 0,
    updateInterval: 25, // ms

    postCreate: function() {
      this.inherited(arguments);

      // connect button handlers
      this.own(
        on(this._startButton, "click", lang.hitch(this, this._onStart)),
        on(this._stopButton, "click", lang.hitch(this, this._onStop))
      );
    },

    startup: function() {
      this.inherited(arguments);
    },

    destroy: function() {
      this.inherited(arguments);
    },

    start: function() {
      if(!this.started()) {
        this.stopTime = null;
        this.startTime = Date.now();
      }
    },

    stop: function() {
      if(this.started()) {
        this.stopTime = Date.now();
        this.totalTime += (this.stopTime - this.startTime);
        this.startTime = null;
      }
    },

    time: function() {
      return this.stopped() ? this.totalTime : (this.started() ? (this.totalTime + (Date.now() - this.startTime)) : 0);
    },

    displayTime: function() {
      var totalTime = this.time() || 0,
        milliseconds = parseInt(totalTime % 1000),
        seconds = parseInt(((totalTime - milliseconds) / 1000) % 60),
        minutes = parseInt(((((totalTime - milliseconds) / 1000) - seconds) / 60) % 60),
        hours = parseInt(((((((totalTime - milliseconds) / 1000) - seconds) / 60) - minutes) / 60) % 24),
        times = [hours, minutes, seconds, milliseconds];
      return (times[0] < 10 ? "0" + times[0] : times[0]) + ":" +
        (times[1] < 10 ? "0" + times[1] : times[1]) + ":" +
        (times[2] < 10 ? "0" + times[2] : times[2]) + ":" +
        (times[3] < 10 ? "00" + times[3] : (times[3] < 100 ? "0" + times[3] : times[3]));
    },

    started: function() {
      return !!(this.startTime);
    },

    stopped: function() {
      return !!(this.stopTime);
    },

    reset: function() {
      this.startTime = null;
      this.stopTime = null;
      this.totalTime = 0;
    },

    _updateDisplay: function() {
      domAttr.set(this._displayNode, "innerHTML", this.displayTime());
    },

    _onStart: function() {
      this.start();
      if(!this.displayInterval) {
        this.displayInterval = setInterval(lang.hitch(this, this._updateDisplay), this.updateInterval);
      }
    },

    _onStop: function() {
      if(this.started()) {
        this.stop();
      } else {
        this.reset();
        if(this.displayInterval) {
          clearInterval(this.displayInterval);
          this.displayInterval = null;
        }
        this._updateDisplay();
      }
    }
  });
});