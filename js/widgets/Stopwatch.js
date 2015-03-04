define([
  "./_StopwatchMixin",

  "dijit/_TemplatedMixin",
  "dijit/_WidgetBase",

  "dojo/_base/declare",
  "dojo/dom-attr",
  "dojo/on",

  "dojo/text!./templates/Stopwatch.html"
], function(
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

    // ctor options
    updateInterval: 25, // time in ms

    constructor: function(options) {
      this.updateInterval = options.updateInterval || 25;
    },

    postCreate: function() {
      this.inherited(arguments);

      // connect button handlers
      this.own(
        on(this._startButton, "click", this._onStart.bind(this)),
        on(this._stopButton, "click", this._onStop.bind(this))
      );
    },

    _updateDisplay: function() {
      domAttr.set(this._displayNode, "innerHTML", this.displayTime());
    },

    _onStart: function() {
      this.start();
      if(!this._displayInterval) {
        this._displayInterval = setInterval(this._updateDisplay.bind(this));
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
