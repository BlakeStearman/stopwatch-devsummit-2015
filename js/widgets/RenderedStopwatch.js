define([
  "./_RenderedStopwatchMixin",
  "./Stopwatch",

  "dojo/_base/declare"

], function (
  _RenderedStopwatchMixin, Stopwatch,
  declare
) {

  return declare([Stopwatch, _RenderedStopwatchMixin], {
    declaredClass: "widgets.RenderedStopwatch",

    baseClass: "Stopwatch RenderedStopwatch"
  });

});
