(function () {
  var VISIBLE_COUNT = 3;
  var toggle = document.getElementById('news-toggle');
  if (!toggle) return;

  var list = toggle.parentElement.querySelector('ul');
  if (!list) return;

  var items = list.querySelectorAll('li');
  var expanded = false;

  // Hide items beyond VISIBLE_COUNT on load
  for (var i = VISIBLE_COUNT; i < items.length; i++) {
    items[i].classList.add('news-hidden');
  }

  toggle.addEventListener('click', function () {
    expanded = !expanded;

    if (expanded) {
      toggle.classList.add('expanded');
      for (var i = VISIBLE_COUNT; i < items.length; i++) {
        items[i].classList.remove('news-hidden');
      }
    } else {
      toggle.classList.remove('expanded');
      for (var i = VISIBLE_COUNT; i < items.length; i++) {
        items[i].classList.add('news-hidden');
      }
    }
  });
})();
