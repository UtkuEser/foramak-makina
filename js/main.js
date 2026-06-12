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
        /* Açık kalan alt menüleri kapat */
        mobileMenu.querySelectorAll('.mobile-nav-group.is-open').forEach(function (group) {
            group.classList.remove('is-open');
            var t = group.querySelector('.mobile-submenu-toggle');
            var s = group.querySelector('.mobile-submenu');
            if (t) t.setAttribute('aria-expanded', 'false');
            if (s) s.hidden = true;
        });
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            if (hamburger.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-nav-cta, .mobile-submenu a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    }


    /* === ACTIVE NAV LINK === */
    var pagePath = window.location.pathname.split('/').pop() || 'index.html';

    var sectionMap = {
        'sac-lazer-kesim.html':          'hizmetler.html',
        'boru-profil-lazer-kesim.html':  'hizmetler.html',
        'sac-bukum.html':                'hizmetler.html',
        'kaynakli-imalat.html':          'hizmetler.html',
        'paslanmaz-imalat.html':         'hizmetler.html',
        'aluminyum-imalat.html':         'hizmetler.html',
        'metal-isleme.html':             'hizmetler.html',
        'ozel-proje-imalati.html':       'hizmetler.html',
        'moduler-tesisat-sistemleri.html': 'hizmetler.html',
        'aritma-sistemleri.html':          'hizmetler.html',
    };
    var effectivePath = sectionMap[pagePath] || pagePath;

    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(function (link) {
        var href = (link.getAttribute('href') || '').split('/').pop();
        if (href === pagePath || href === effectivePath || (pagePath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    if (sectionMap[pagePath]) {
        document.querySelectorAll('[data-section="hizmetler"]').forEach(function (el) {
            el.classList.add('active');
        });
    }


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
   MEGA MENU — Ekrandan taşma düzeltme + Escape kapat
   ============================================================ */

/* Mega menu viewport clamp: sağa veya sola taşmayı engelle */
document.querySelectorAll('.nav-item--mega').forEach(function (item) {
    var menu = item.querySelector('.mega-menu');
    if (!menu) return;

    item.addEventListener('mouseenter', function () {
        /* Taşma kontrolünü bir sonraki frame'e bırak (display'dan sonra) */
        requestAnimationFrame(function () {
            var rect = menu.getBoundingClientRect();
            var vw   = document.documentElement.clientWidth;
            var shift = 0;

            if (rect.right > vw - 8) {
                shift = -(rect.right - vw + 8);
            } else if (rect.left < 8) {
                shift = 8 - rect.left;
            }

            if (shift !== 0) {
                menu.style.marginLeft = shift + 'px';
            } else {
                menu.style.marginLeft = '';
            }
        });
    });
});


/* ============================================================
   HERO SLIDER — standalone, DOMContentLoaded
   Selectors: .hero-slide | .hero-slide-content | .hero-dot
              .hero-arrow--prev | .hero-arrow--next
   Active class: is-active
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

    /* === MOBİL HİZMETLER ALT LİSTE === */
    document.querySelectorAll('.mobile-submenu-toggle').forEach(function (toggle) {
        toggle.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var group = toggle.closest('.mobile-nav-group');
            if (!group) return;
            var submenu = group.querySelector('.mobile-submenu');
            if (!submenu) return;
            var isOpen = group.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            submenu.hidden = !isOpen;
        });
    });

    /* === HERO SLIDER === */
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
