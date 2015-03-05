define([
  "./_StopwatchMixin",

  "dijit/_TemplatedMixin",
  "dijit/_WidgetBase",

  "dojo/_base/declare",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-style",
  "dojo/on",

  "dojo/text!./templates/Countdown.html"
], function(
  _StopwatchMixin,
  _TemplatedMixin, _WidgetBase,
  declare, domAttr, domClass, domStyle, on,
  template
) {

  return declare([_WidgetBase, _TemplatedMixin, _StopwatchMixin], {

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

      // connect button handlers
      this.own(
        on(this._countdownButton, "click", this._countdownClicked.bind(this))
      );
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
      domClass.remove("countdown-button", "alarm");
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
        domClass.add("countdown-button", "alarm");

        this._stopCountdown();
      }

      domAttr.set(this._displayNode, "innerHTML", timeLeft);
    },

    _startCountdown: function () {
      this.start();
      domStyle.set("countdown-button", "visibility", "hidden");
      if (!this._displayInterval) {
        this._displayInterval = setInterval(this._updateDisplay.bind(this));
      }
    },

    _stopCountdown: function () {
      this.stop();
      domAttr.set("countdown-button", "innerHTML", "Reset");
      domStyle.set("countdown-button", "visibility", "visible");
    },

    _resetCountdown: function () {
      this.reset();
      this._updateDisplay();
      this._isReset = true;

      domAttr.set("countdown-button", "innerHTML", "Start");

      if (!isNaN(this._displayInterval)) {
        clearInterval(this._displayInterval);
        this._displayInterval = null;
      }
    },

    _countdownClicked: function () {
      if (this._isReset) {
        if (this.isRunning()) {
          this._stopCountdown();
        }
        else {
          this._startCountdown();
        }
        this._isReset = false;
      }
      else {
        this._resetCountdown();
      }
    }
  });
});
