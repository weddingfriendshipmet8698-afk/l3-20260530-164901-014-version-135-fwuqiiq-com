
(function() {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navMenu = document.querySelector('[data-nav-menu]');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;
  var heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });

    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  function startHero() {
    if (heroTimer || slides.length < 2) {
      return;
    }

    heroTimer = window.setInterval(function() {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      showSlide(index);
      if (heroTimer) {
        window.clearInterval(heroTimer);
        heroTimer = null;
      }
      startHero();
    });
  });

  showSlide(0);
  startHero();

  var searchInput = document.querySelector('[data-search-input]');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var cardList = document.querySelector('[data-card-list]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var emptyState = document.querySelector('[data-empty-state]');
  var activeFilter = 'all';

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var keyword = normalize(searchInput ? searchInput.value : '');
    var visibleCount = 0;

    cards.forEach(function(card) {
      var text = normalize(card.getAttribute('data-search') || card.textContent);
      var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchesFilter = activeFilter === 'all' || text.indexOf(normalize(activeFilter)) !== -1;
      var visible = matchesKeyword && matchesFilter;

      card.style.display = visible ? '' : 'none';

      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visibleCount === 0);
    }

    if (cardList) {
      cardList.setAttribute('data-visible-count', String(visibleCount));
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      activeFilter = button.getAttribute('data-filter') || 'all';
      filterButtons.forEach(function(item) {
        item.classList.toggle('is-active', item === button);
      });
      applyFilters();
    });
  });

  applyFilters();
}());
