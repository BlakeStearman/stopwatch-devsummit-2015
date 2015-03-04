define([
  "./_RenderedStopwatchMixin",
  "./Stopwatch",

  "dojo/_base/declare"

], function (
  RenderedStopwatchMixin, Stopwatch,
  declare
) {

  return declare([Stopwatch, RenderedStopwatchMixin], {
    declaredClass: "widgets.RenderedStopwatch",

    baseClass: "Stopwatch RenderedStopwatch"
  });

});
