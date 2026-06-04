/* ============================================================
   FORAMAK MAKİNE MÜHENDİSLİK — main.js
   ============================================================ */

(function () {
    'use strict';

    /* === COPYRIGHT YEAR === */
    document.querySelectorAll('.js-year').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });


    /* === STICKY HEADER === */
    var header = document.querySelector('.header');
    if (header) {
        function onScroll() {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }


    /* === HAMBURGER / MOBILE MENU === */
    var hamburger  = document.querySelector('.hamburger');
    var mobileMenu = document.querySelector('.mobile-menu');

    function openMenu() {
        hamburger.classList.add('open');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            if (hamburger.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    }


    /* === ACTIVE NAV LINK === */
    var pagePath = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(function (link) {
        var href = (link.getAttribute('href') || '').split('/').pop();
        if (href === pagePath || (pagePath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });


    /* === SCROLL REVEAL === */
    var reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && reveals.length) {
        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
        );
        reveals.forEach(function (el) { revealObserver.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('visible'); });
    }


    /* === FILE UPLOAD LABEL === */
    var fileInput = document.getElementById('dosya');
    var fileText  = document.querySelector('.file-upload-title');

    if (fileInput && fileText) {
        fileInput.addEventListener('change', function () {
            var count = fileInput.files.length;
            if (count > 0) {
                fileText.textContent = count === 1
                    ? fileInput.files[0].name
                    : count + ' dosya seçildi';
            } else {
                fileText.textContent = 'Dosya seçin veya bu alana sürükleyin';
            }
        });
    }


    /* === FORM PREVENT DEFAULT (demo) === */
    var forms = document.querySelectorAll('form');
    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            /* Form backend bağlantısı buraya eklenecek */
        });
    });

})();


/* ============================================================
   HERO SLIDER — standalone, DOMContentLoaded
   Selectors: .hero-slide | .hero-slide-content | .hero-dot
              .hero-arrow--prev | .hero-arrow--next
   Active class: is-active
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    var slides   = document.querySelectorAll('.hero-slide');
    var contents = document.querySelectorAll('.hero-slide-content');
    var dots     = document.querySelectorAll('.hero-dot');
    var prevBtn  = document.querySelector('.hero-arrow--prev');
    var nextBtn  = document.querySelector('.hero-arrow--next');

    if (!slides || !slides.length) return;

    var current          = 0;
    var timer            = null;
    var pauseTimer       = null;
    var fallbackDuration = 5800;
    var CROSSFADE_MS     = 1100;

    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            showSlide(current + 1);
        }, fallbackDuration);
    }

    function showSlide(index) {
        var previous = current;
        current = ((index % slides.length) + slides.length) % slides.length;

        var prevVideo = slides[previous].querySelector('video');
        var nextVideo = slides[current].querySelector('video');

        /* Yeni videoyu class değişiminden önce başlat — decoder ısınır */
        if (nextVideo) {
            nextVideo.currentTime = 0;
            nextVideo.play().catch(function () {});
        }

        /* Active class'ları değiştir → CSS crossfade başlar */
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });
        contents.forEach(function (content, i) {
            content.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === current);
            dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
        });

        /* Eski videoyu crossfade bittikten sonra durdur */
        if (prevVideo && previous !== current) {
            clearTimeout(pauseTimer);
            var vidToPause = prevVideo;
            pauseTimer = setTimeout(function () {
                vidToPause.pause();
            }, CROSSFADE_MS);
        }

        resetTimer();
    }

    /* ended event + loop kaldır */
    slides.forEach(function (slide, i) {
        var video = slide.querySelector('video');
        if (!video) return;
        video.removeAttribute('loop');
        video.addEventListener('ended', function () {
            clearTimeout(timer);
            showSlide(i + 1);
        });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { showSlide(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showSlide(current + 1); });
    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { showSlide(i); });
    });

    showSlide(0);
});
