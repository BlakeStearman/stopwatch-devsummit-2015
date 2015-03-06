define([
  "./_StopwatchMixin",

  "dijit/_TemplatedMixin",
  "dijit/_WidgetBase",
  "dojo/Evented",

  "dojo/_base/declare",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-style",
  "dojo/on",

  "dojo/text!./templates/Countdown.html"
], function(
  _StopwatchMixin,
  _TemplatedMixin, _WidgetBase, Evented,
  declare, domAttr, domClass, domStyle, on,
  template
) {

  return declare([_WidgetBase, _TemplatedMixin, _StopwatchMixin, Evented], {

    declaredClass: "widgets.Countdown",
    baseClass: "Countdown",
    templateString: template,

    _displayInterval: null,
    _defaultTimeInSec: 10,
    _defaultUpdateIntervalInMs: 100,
    _isReset: true,

    // constructor options
    goalTimeInSec: null,
    updateIntervalInMs: null,

    constructor: function (options) {
      // ensure proper types
      this.goalTimeInSec = parseInt(options.goalTimeInSec) || this._defaultTimeInSec;
      this.updateIntervalInMs = parseInt(options.updateIntervalInMs) || this._defaultUpdateIntervalInMs;
    },

    postCreate: function () {
      this.inherited(arguments);
    },

    startup: function () {
      this.inherited(arguments);

      // ensure goal time displayed
      this._updateDisplay();
    },

    displayTime: function () {
      return this._secondsLeft();
    },

    _secondsLeft: function () {
      return Math.round(this.goalTimeInSec - (this.rawTime() / 1000));
    },

    reset: function () {
      this.inherited(arguments);

      // reset alarm state
      domClass.remove("timer", "alarm");
    },

    _setGoalTimeAttr: function (goalTime) {
      // use default if goalTime 0 or not set
      this.goalTimeInSec = parseInt(goalTime) || this._defaultTimeInSec;
    },

    _updateDisplay: function () {
      var timeLeft = this.displayTime();

      if (timeLeft <= 0) {
        timeLeft = 0;

        // set alarm state
        domClass.add("timer", "alarm");

        if(this.isRunning()) {
          this.emit("launch");
        }

        this.stopCountdown();
      }

      domAttr.set(this._displayNode, "innerHTML", timeLeft);
    },

    startCountdown: function () {
      this.start();
      if (!this._displayInterval) {
        this._displayInterval = setInterval(this._updateDisplay.bind(this));
      }
    },

    stopCountdown: function () {
      this.stop();
    },

    resetCountdown: function () {
      this.reset();
      this._updateDisplay();

      if (!isNaN(this._displayInterval)) {
        clearInterval(this._displayInterval);
        this._displayInterval = null;
      }
    }
  });
});
