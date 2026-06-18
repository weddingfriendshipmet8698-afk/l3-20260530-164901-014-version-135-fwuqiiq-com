(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
      var prev = carousel.querySelector('[data-hero-prev]');
      var next = carousel.querySelector('[data-hero-next]');
      var active = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === active);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(active + 1);
        }, 5200);
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener('click', function () {
          show(active - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(active + 1);
          restart();
        });
      }

      show(0);
      restart();
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card[data-search], .rank-item[data-search]'));
    var filterInputs = Array.prototype.slice.call(document.querySelectorAll('.page-filter input[name="q"]'));
    var emptyState = document.querySelector('.empty-state');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    function normalize(value) {
      return (value || '').toString().trim().toLowerCase();
    }

    function applyFilter(value) {
      var query = normalize(value);
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search') || card.textContent);
        var matched = !query || haystack.indexOf(query) !== -1;
        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });
      if (emptyState) {
        emptyState.style.display = visible ? 'none' : 'block';
      }
      filterInputs.forEach(function (input) {
        input.value = value || '';
      });
    }

    if (cards.length && initialQuery) {
      applyFilter(initialQuery);
    }

    document.querySelectorAll('.page-filter').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        applyFilter(input ? input.value : '');
      });
    });

    document.querySelectorAll('.filter-chips button').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('.filter-chips button').forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        applyFilter(button.getAttribute('data-filter') || '');
      });
    });
  });
})();
