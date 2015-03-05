define([
  "./_StopwatchMixin",

  "dijit/_TemplatedMixin",
  "dijit/_WidgetBase",

  "dojo/_base/declare",
  "dojo/dom-attr",
  "dojo/on",

  "dojo/text!./templates/Stopwatch.html"
], function (
  _StopwatchMixin,
  _TemplatedMixin, _WidgetBase,
  declare, domAttr, on,
  template
) {

  return declare([_WidgetBase, _TemplatedMixin, _StopwatchMixin], {

    declaredClass: "widgets.Stopwatch",
    baseClass: "Stopwatch",
    templateString: template,

    _displayInterval: null,
    _defaultUpdateIntervalInMs: 25,

    // constructor options
    updateIntervalInMs: null,

    constructor: function (options) {
      this.updateIntervalInMs = options.updateIntervalInMs || this._defaultUpdateIntervalInMs;
    },

    postCreate: function () {
      this.inherited(arguments);

      // connect button handlers
      this.own(
        on(this._startButton, "click", this._onStart.bind(this)),
        on(this._stopButton, "click", this._onStop.bind(this))
      );
    },

    _onStart: function () {
      this.start();

      if (!this._displayInterval) {
        this._displayInterval = setInterval(this._updateDisplay.bind(this));
      }
    },

    _updateDisplay: function () {
      domAttr.set(this._displayNode, "innerHTML", this.displayTime());
    },

    _onStop: function () {
      if (this.isRunning()) {
        this.stop();
      }
      else {
        this.reset();
        this._updateDisplay();
      }

      if (!isNaN(this._displayInterval)) {
        clearInterval(this._displayInterval);
        this._displayInterval = null;
      }
    }
  });
});
