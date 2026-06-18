(function() {
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function() {
      var open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function startHero() {
    if (timer || slides.length < 2) {
      return;
    }
    timer = setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      showSlide(Number(dot.getAttribute('data-target') || 0));
      if (timer) {
        clearInterval(timer);
        timer = null;
        startHero();
      }
    });
  });

  startHero();

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  Array.prototype.slice.call(document.querySelectorAll('.category-filter')).forEach(function(input) {
    var root = input.closest('section') || document;
    var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card, .rank-card'));
    input.addEventListener('input', function() {
      var q = normalize(input.value);
      cards.forEach(function(card) {
        var hay = normalize((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '') + ' ' + card.textContent);
        card.classList.toggle('is-hidden-by-filter', q && hay.indexOf(q) === -1);
      });
    });
  });

  var searchInput = document.getElementById('siteSearchInput');
  var searchResults = document.getElementById('siteSearchResults');

  function renderSearch(query) {
    if (!searchInput || !searchResults || !Array.isArray(window.SEARCH_MOVIES)) {
      return;
    }
    var q = normalize(query);
    searchInput.value = query || '';
    searchResults.innerHTML = '';
    if (!q) {
      return;
    }
    var results = window.SEARCH_MOVIES.filter(function(item) {
      return normalize(item.title + ' ' + item.meta + ' ' + item.category).indexOf(q) !== -1;
    }).slice(0, 80);
    results.forEach(function(item) {
      var a = document.createElement('a');
      a.className = 'search-result-card';
      a.href = item.url;
      a.innerHTML = '<img src="' + item.image + '" alt="' + item.title.replace(/"/g, '&quot;') + '"><div><h3>' + item.title + '</h3><p>' + item.desc + '</p><span>' + item.meta + '</span></div>';
      searchResults.appendChild(a);
    });
  }

  if (searchInput && searchResults) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('search') || '';
    renderSearch(initial);
    searchInput.addEventListener('input', function() {
      renderSearch(searchInput.value);
    });
  }
})();
