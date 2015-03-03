define([
  "./_StopwatchMixin",

  "dijit/_TemplatedMixin",
  "dijit/_WidgetBase",

  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-style",
  "dojo/on",

  "dojo/text!./templates/Countdown.html"
], function(
  _StopwatchMixin,
  _TemplatedMixin, _WidgetBase,
  declare, lang, dom, domAttr, domClass, domStyle, on,
  template
) {

  return declare([_WidgetBase, _TemplatedMixin, _StopwatchMixin], {

    declaredClass: "widgets.Countdown",
    baseClass: "Countdown",
    templateString: template,

    _displayInterval: null,
    _defaultTime: 10,
    _isReset: true,

    // ctor options
    goalTime: 10,        // time in s
    updateInterval: 100, // time in ms

    constructor: function(options) {
      this.inherited(arguments);

      // ensure proper types
      this.goalTime = parseInt(options.goalTime) || this._defaultTime; // default to 10 seconds
      this.updateInterval = parseInt(options.updateInterval) || 100;   // default to 100 ms
    },

    postCreate: function() {
      this.inherited(arguments);

      // connect button handlers
      this.own(
        on(this._countdownButton, "click", lang.hitch(this, this._countdownClicked))
      );
    },

    startup: function() {
      this.inherited(arguments);
      // ensure goal time displayed
      this._updateDisplay();
    },

    displayTime: function() {
      // calculate seconds left
      return Math.round((this.goalTime || this._defaultTime) - (this.rawTime() / 1000));
    },

    reset: function() {
      // ensure superclass work is done
      this.inherited(arguments);

      // reset alarm state
      domClass.remove(dom.byId("timer"), "alarm");
      domClass.remove(dom.byId("countdown-button"), "alarm");
    },

    _setGoalTimeAttr: function(goalTime) {
      // use default if goalTime 0 or not set
      this.goalTime = parseInt(goalTime) || this._defaultTime;
    },

    _updateDisplay: function() {
      var timeLeft = this.displayTime();
      if(timeLeft <= 0) {
        timeLeft = 0;

        // set alarm state
        domClass.add(dom.byId("timer"), "alarm");
        domClass.add(dom.byId("countdown-button"), "alarm");

        // stop countdown
        this._stopCountdown();
      }

      domAttr.set(this._displayNode, "innerHTML", timeLeft);
    },

    _startCountdown: function() {
      // start countdown
      this.start();
      domStyle.set(dom.byId("countdown-button"), "visibility", "hidden");
      if(!this._displayInterval) {
        this._displayInterval = setInterval(lang.hitch(this, this._updateDisplay), this.updateInterval);
      }
    },

    _stopCountdown: function() {
      // stop countdown
      this.stop();
      domAttr.set(dom.byId("countdown-button"), "innerHTML", "Reset");
      domStyle.set(dom.byId("countdown-button"), "visibility", "visible");
    },

    _resetCountdown: function() {
      // reset countdown
      this.reset();
      domAttr.set(dom.byId("countdown-button"), "innerHTML", "Start");
      if(this._displayInterval) {
        clearInterval(this._displayInterval);
        this._displayInterval = null;
      }
      this._updateDisplay();
      this._isReset = true;
    },

    _countdownClicked: function() {
      if(this._isReset) {
        if(this.isRunning()) {
          this._stopCountdown();
        } else {
          this._startCountdown();
        }
        this._isReset = false;
      } else {
        this._resetCountdown();
      }
    }
  });
});
