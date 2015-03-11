define([
  "./_StylizedStopwatchMixin",
  "./Stopwatch",

  "dojo/_base/declare"
],
function (
  _StylizedStopwatchMixin, Stopwatch,
  declare
) {

  return declare([Stopwatch, _StylizedStopwatchMixin], {
    declaredClass: "widgets.StylizedStopwatch",
    baseClass: "Stopwatch StylizedStopwatch"
  });

});
