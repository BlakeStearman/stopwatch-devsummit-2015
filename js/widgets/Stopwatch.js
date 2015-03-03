define([
  "./_StopwatchMixin",

  "dijit/_TemplatedMixin",
  "dijit/_WidgetBase",

  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-attr",
  "dojo/on",

  "dojo/text!./templates/Stopwatch.html"
], function(
  _StopwatchMixin,
  _TemplatedMixin, _WidgetBase,
  declare, lang, domAttr, on,
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

    _updateDisplay: function() {
      domAttr.set(this._displayNode, "innerHTML", this.displayTime());
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
