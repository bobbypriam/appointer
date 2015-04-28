document.querySelector('#how-it-works')
  .addEventListener("click", runScroll, false);

function runScroll() {
  var target = document.querySelector('#benefit').getBoundingClientRect().top;
  scrollTo(document.documentElement, target, 500);
  return false;
}

function scrollTo(element, to, duration) {
  if (duration < 0) return;

  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;

  setTimeout(function () {
    if (element.scrollTop + perTick >= to) return;
    element.scrollTop = element.scrollTop + perTick;
    scrollTo(element, to, duration - 10);
  }, 10);
}