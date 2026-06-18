(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
      document.body.classList.toggle('menu-open', panel.classList.contains('open'));
    });
  }

  var searchInput = document.querySelector('[data-card-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var emptyState = document.querySelector('[data-empty-state]');
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var activeFilter = 'all';

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var term = normalize(searchInput ? searchInput.value : '');
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var category = card.getAttribute('data-category') || '';
      var matchesTerm = !term || haystack.indexOf(term) !== -1;
      var matchesFilter = activeFilter === 'all' || category === activeFilter;
      var show = matchesTerm && matchesFilter;

      card.classList.toggle('is-hidden', !show);

      if (show) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('visible', visible === 0);
    }
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (query) {
      searchInput.value = query;
    }

    searchInput.addEventListener('input', applyFilters);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      activeFilter = chip.getAttribute('data-filter') || 'all';
      chips.forEach(function (item) {
        item.classList.toggle('active', item === chip);
      });
      applyFilters();
    });
  });

  applyFilters();
})();
