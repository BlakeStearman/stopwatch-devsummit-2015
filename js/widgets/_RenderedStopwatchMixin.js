define([
    "dojo/_base/declare",
    "dojo/_base/window",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/on"],
  function (
    declare, window, domAttr, domConstruct, on
  ) {

    return declare(null, {

      declaredClass: "widgets._RenderedStopwatchMixin",

      _lineWidth: 20,
      _radius: 180,
      _circleOffset: 20,

      _canvas: null,
      _context: null,

      buildRendering: function () {
        this.inherited(arguments);

        var canvas = domConstruct.create("canvas", {
          className: "clock"
        }, this.domNode);

        this._canvas = canvas;
        this._context = canvas.getContext("2d");

        this._updateCanvasSize();
      },

      _updateCanvasSize: function () {
        domAttr.set(this._canvas, {
          height: window.global.innerHeight,
          width: window.global.innerWidth
        });

        this._render();
      },

      _render: function () {
        requestAnimationFrame(this._drawClock.bind(this));
      },

      _drawClock: function () {
        var canvas = this._canvas,
            w = canvas.width * 0.5,
            h = canvas.height * 0.5,
            outerRadius = this._radius,
            middleRadius = outerRadius - this._circleOffset,
            innerRadius = middleRadius - this._circleOffset,
            startAngle = 0,
            endAngle = 2 * Math.PI,
            lineWidth = this._lineWidth,
            topAngle = 1.5 * Math.PI,
            elapsedTimeInMs = this.rawTime(),
            msInSec = 60000,
            msInMin = 3600000,
            msInHour = 216000000,
            secMs = elapsedTimeInMs % msInSec,
            minMs = elapsedTimeInMs % msInMin,
            hourMs = elapsedTimeInMs % msInHour,
            fullCircleInRad = 2 * Math.PI,
            secEndAngle = ((fullCircleInRad / msInSec) * secMs) + topAngle,
            minEndAngle = ((fullCircleInRad / msInMin) * minMs) + topAngle,
            hourEndAngle = ((fullCircleInRad / msInHour) * hourMs) + topAngle;

        this._context.clearRect(0, 0, canvas.width, canvas.height);

        // draw clock
        this._drawArc(w, h, outerRadius, startAngle, endAngle, "#ccc", lineWidth);
        this._drawArc(w, h, middleRadius , startAngle, endAngle, "#ddd", lineWidth);
        this._drawArc(w, h, innerRadius, startAngle, endAngle, "#eee", lineWidth);

        // draw seconds
        this._drawArc(w, h, outerRadius, topAngle, secEndAngle, "#ff8c00", lineWidth);

        // draw minutes
        this._drawArc(w, h, middleRadius, topAngle, minEndAngle, "#fa9d2a", lineWidth);

        // draw hours
        this._drawArc(w, h, innerRadius, topAngle, hourEndAngle, "#ffae4c", lineWidth);
      },

      _drawArc: function (width, height, radius, startAngle, endAngle, color, lineWidth) {
        var ctx = this._context;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.arc(width, height, radius, startAngle, endAngle);
        ctx.stroke();
      },

      postCreate: function () {
        this.inherited(arguments);
        this._render();
        on(window.global, "resize", this._updateCanvasSize.bind(this));
      },

      _updateDisplay: function () {
        this.inherited(arguments);
        this._render();
      }
    });

  });
