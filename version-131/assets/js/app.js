(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
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
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-filter-box]')).forEach(function (box) {
        var input = box.querySelector('[data-filter-input]');
        var select = box.querySelector('[data-filter-select]');
        var list = document.querySelector('[data-card-list]');

        if (!list || !input) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');

        if (initialQuery && input.hasAttribute('data-query-sync')) {
            input.value = initialQuery;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var query = normalize(input.value);
            var year = select ? normalize(select.value) : '';
            Array.prototype.slice.call(list.querySelectorAll('[data-card]')).forEach(function (card) {
                var title = normalize(card.getAttribute('data-title'));
                var tags = normalize(card.getAttribute('data-tags'));
                var cardYear = normalize(card.getAttribute('data-year'));
                var region = normalize(card.getAttribute('data-region'));
                var haystack = title + ' ' + tags + ' ' + cardYear + ' ' + region;
                var queryMatch = !query || haystack.indexOf(query) !== -1;
                var yearMatch = !year || cardYear === year;
                card.classList.toggle('is-hidden', !(queryMatch && yearMatch));
            });
        }

        input.addEventListener('input', applyFilter);
        if (select) {
            select.addEventListener('change', applyFilter);
        }
        applyFilter();
    });
}());
