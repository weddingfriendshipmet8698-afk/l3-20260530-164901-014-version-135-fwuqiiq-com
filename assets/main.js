(function() {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function() {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function() {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function() {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        showSlide(current + 1);
        startTimer();
      });
    }

    startTimer();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function applySearch(input) {
    var section = input.closest('section') || document;
    var grid = section.querySelector('[data-card-grid]') || document;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
    var empty = section.querySelector('[data-empty]');
    var value = normalize(input.value);
    var visible = 0;

    cards.forEach(function(card) {
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags'),
        card.textContent
      ].join(' '));
      var matched = !value || text.indexOf(value) !== -1;
      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.hidden = visible !== 0;
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-search]')).forEach(function(input) {
    input.addEventListener('input', function() {
      applySearch(input);
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (query && !input.value) {
      input.value = query;
      applySearch(input);
    }
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-clear-search]')).forEach(function(button) {
    button.addEventListener('click', function() {
      var section = button.closest('section') || document;
      var input = section.querySelector('[data-search]');

      if (input) {
        input.value = '';
        applySearch(input);
        input.focus();
      }
    });
  });
})();
