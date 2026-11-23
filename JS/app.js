// =========================================================
//   APP.JS — Portfolio de Fernando Puche (v2)
//   Todo en JavaScript "normal", sin librerías.
// =========================================================

var portfolioData = [];

// ---------- CARGAR DATOS ----------
function loadPortfolio() {
    return fetch('data/portfolio.json')
        .then(function (r) { return r.json(); })
        .then(function (datos) { portfolioData = datos; })
        .catch(function () { console.log('Error al cargar portfolio.json'); });
}

// Pone un 0 delante: 1 -> "01"
function dosCifras(n) {
    return (n < 10 ? '0' : '') + n;
}

// ---------- PANTALLA DE CARGA (contador 0 → 100) ----------
function initLoader(onDone) {
    var loader = document.getElementById('loader');
    if (!loader) { document.body.classList.add('is-ready'); onDone(); return; }

    var count = document.getElementById('loader-count');
    var bar = document.getElementById('loader-bar');
    var valor = 0;

    var timer = setInterval(function () {
        // Sube rápido al principio y más despacio al final
        valor += Math.max(1, Math.round((100 - valor) / 8));
        if (valor >= 100) valor = 100;
        count.textContent = valor;
        bar.style.width = valor + '%';

        if (valor === 100) {
            clearInterval(timer);
            setTimeout(function () {
                loader.classList.add('is-done');
                document.body.classList.remove('is-loading');
                document.body.classList.add('is-ready');
                onDone();
            }, 250);
        }
    }, 45);
}

// ---------- MENÚ ----------
function initMenu() {
    var btn = document.getElementById('menu-btn');
    var menu = document.getElementById('menu');
    if (!btn || !menu) return;

    function cerrar() {
        document.body.classList.remove('menu-open');
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
    }

    btn.addEventListener('click', function () {
        var abierto = document.body.classList.toggle('menu-open');
        btn.setAttribute('aria-expanded', abierto);
        menu.setAttribute('aria-hidden', !abierto);
    });

    // Al pulsar un enlace del menú, se cierra
    menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', cerrar);
    });

    // Tecla ESC también cierra
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') cerrar();
    });
}

// ---------- CURSOR PERSONALIZADO ----------
function initCursor() {
    var cursor = document.getElementById('cursor');
    var label = document.getElementById('cursor-label');
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

    var x = innerWidth / 2, y = innerHeight / 2;   // donde está el ratón
    var cx = x, cy = y;                             // donde está el círculo

    window.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; });

    // El círculo persigue al ratón con un poco de retraso (queda más suave)
    function animar() {
        cx += (x - cx) * 0.2;
        cy += (y - cy) * 0.2;
        cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
        requestAnimationFrame(animar);
    }
    animar();

    // Cambia de tamaño según lo que haya debajo
    document.addEventListener('mouseover', function (e) {
        var conTexto = e.target.closest('[data-cursor]');
        var enlace = e.target.closest('a, button');
        cursor.classList.remove('is-big', 'is-link');
        if (conTexto) {
            label.textContent = conTexto.getAttribute('data-cursor');
            cursor.classList.add('is-big');
        } else if (enlace) {
            cursor.classList.add('is-link');
        }
    });
}

// ---------- ANIMACIONES AL HACER SCROLL ----------
function initReveal() {
    var elementos = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        elementos.forEach(function (el) { el.classList.add('is-in'); });
        return;
    }
    var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
            if (en.isIntersecting) {
                en.target.classList.add('is-in');
                obs.unobserve(en.target);
            }
        });
    }, { threshold: 0.15 });
    elementos.forEach(function (el) { obs.observe(el); });
}

// ---------- LETRAS DEL HERO QUE SE APLASTAN ----------
function initHeroLetters() {
    document.querySelectorAll('.hero__line span').forEach(function (letra) {
        letra.addEventListener('mouseenter', function () { letra.classList.add('squash'); });
        letra.addEventListener('mouseleave', function () {
            setTimeout(function () { letra.classList.remove('squash'); }, 250);
        });
    });
}

// ---------- MANIFIESTO: LAS PALABRAS SE ENCIENDEN CON EL SCROLL ----------
function initManifesto() {
    var texto = document.getElementById('manifesto');
    if (!texto) return;

    // Envolvemos cada palabra en un <span class="w">
    function envolver(nodo) {
        Array.prototype.slice.call(nodo.childNodes).forEach(function (hijo) {
            if (hijo.nodeType === 3) {
                var frag = document.createDocumentFragment();
                hijo.textContent.split(/(\s+)/).forEach(function (trozo) {
                    if (trozo.trim() === '') { frag.appendChild(document.createTextNode(trozo)); return; }
                    var s = document.createElement('span');
                    s.className = 'w';
                    s.textContent = trozo;
                    frag.appendChild(s);
                });
                nodo.replaceChild(frag, hijo);
            } else {
                envolver(hijo);
            }
        });
    }
    envolver(texto);

    var palabras = texto.querySelectorAll('.w');
    function actualizar() {
        var r = texto.getBoundingClientRect();
        // 0 cuando el texto entra por abajo, 1 cuando llega a la mitad de la pantalla
        var progreso = (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35);
        progreso = Math.min(1, Math.max(0, progreso));
        var encendidas = Math.round(progreso * palabras.length);
        palabras.forEach(function (p, i) { p.classList.toggle('on', i < encendidas); });
    }
    window.addEventListener('scroll', actualizar, { passive: true });
    actualizar();
}

// ---------- TARJETAS DE PROYECTO (INDEX) ----------
function renderIndex() {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;

    var html = '';
    portfolioData.forEach(function (cat, i) {
        var tags = cat.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('');
        html += ''
            + '<a href="proyecto.html?id=' + cat.id + '" class="wcard" data-cursor="VER">'
            +   (cat.video
                  ? '<video class="wcard__img" src="' + cat.video + '" poster="' + cat.cover + '" muted loop playsinline preload="metadata"></video>'
                  : '<img class="wcard__img" src="' + cat.cover + '" alt="' + cat.titulo + '" loading="lazy">')
            +   '<span class="wcard__num">' + dosCifras(i + 1) + ' / ' + dosCifras(portfolioData.length) + '</span>'
            +   '<div class="wcard__info">'
            +     '<div><h3 class="wcard__title">' + cat.titulo + '</h3>'
            +     '<p class="wcard__sub">' + cat.subtitulo + '</p></div>'
            +     '<div class="wcard__tags">' + tags + '</div>'
            +   '</div>'
            + '</a>';
    });
    grid.innerHTML = html;

    var contador = document.getElementById('work-count');
    if (contador) contador.textContent = dosCifras(portfolioData.length);

    initStackedCards();
    initAutoVideos();
}

// Las tarjetas se apilan y la de atrás se hace pequeña al llegar la siguiente
function initStackedCards() {
    var cards = document.querySelectorAll('.wcard');
    function actualizar() {
        cards.forEach(function (card, i) {
            var siguiente = cards[i + 1];
            if (!siguiente) { card.style.transform = ''; return; }
            var top = card.getBoundingClientRect().top;
            var topSig = siguiente.getBoundingClientRect().top;
            // Cuánto ha subido la siguiente tarjeta por encima de esta (0 a 1)
            var p = 1 - (topSig - top) / card.offsetHeight;
            p = Math.min(1, Math.max(0, p));
            card.style.transform = 'scale(' + (1 - p * 0.08) + ')';
            card.style.filter = 'brightness(' + (1 - p * 0.5) + ')';
        });
    }
    window.addEventListener('scroll', actualizar, { passive: true });
    window.addEventListener('resize', actualizar);
    actualizar();
}

// ---------- SERVICIOS: IMAGEN QUE SIGUE AL RATÓN ----------
function initServices() {
    var preview = document.getElementById('services-preview');
    var lista = document.getElementById('services');
    if (!preview || !lista) return;
    var img = preview.querySelector('img');
    var x = 0, y = 0, px = 0, py = 0;

    lista.querySelectorAll('li').forEach(function (li) {
        li.addEventListener('mouseenter', function () {
            img.src = li.getAttribute('data-img');
            preview.classList.add('is-on');
        });
        li.addEventListener('mouseleave', function () { preview.classList.remove('is-on'); });
    });
    window.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; });

    function animar() {
        px += (x - px) * 0.12;
        py += (y - py) * 0.12;
        preview.style.left = px + 'px';
        preview.style.top = py + 'px';
        requestAnimationFrame(animar);
    }
    animar();
}

// ---------- TIRA DE FOTOS: SE MUEVE EN HORIZONTAL AL HACER SCROLL ----------
function initStrip() {
    var seccion = document.getElementById('strip');
    var track = document.getElementById('strip-track');
    if (!seccion || !track) return;

    function actualizar() {
        var r = seccion.getBoundingClientRect();
        var recorrido = seccion.offsetHeight - innerHeight;          // cuánto scroll vertical hay
        var p = Math.min(1, Math.max(0, -r.top / recorrido));        // de 0 a 1
        var distancia = track.scrollWidth - innerWidth;              // cuánto hay que mover en horizontal
        track.style.transform = 'translateX(' + (-p * distancia) + 'px)';
    }
    window.addEventListener('scroll', actualizar, { passive: true });
    window.addEventListener('resize', actualizar);
    actualizar();
}

// ---------- VÍDEOS QUE SE REPRODUCEN SOLOS CUANDO SE VEN ----------
function initAutoVideos() {
    var videos = document.querySelectorAll('video.wcard__img');
    if (!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
            if (en.isIntersecting) { en.target.play().catch(function () {}); }
            else { en.target.pause(); }
        });
    }, { threshold: 0.25 });
    videos.forEach(function (v) { obs.observe(v); });
}

// ---------- SHOWREEL: SE REPRODUCE AL VERSE Y SE PUEDE ACTIVAR EL SONIDO ----------
function initReel() {
    var video = document.getElementById('reel-video');
    var boton = document.getElementById('reel-sound');
    if (!video || !boton) return;

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entradas) {
            entradas.forEach(function (en) {
                if (en.isIntersecting) video.play().catch(function () {});
                else video.pause();
            });
        }, { threshold: 0.3 }).observe(video);
    }

    boton.addEventListener('click', function () {
        video.muted = !video.muted;
        if (!video.muted) { video.currentTime = 0; video.play(); }
        boton.textContent = video.muted ? 'Activar sonido →' : 'Silenciar ✕';
        boton.classList.toggle('is-on', !video.muted);
    });
}

// ---------- QUIÉN SOY: LENTE QUE DESCUBRE LA FOTO EN COLOR ----------
function initAboutLens() {
    var caja = document.getElementById('about-lens');
    if (!caja) return;
    var foto = caja.querySelector('.about__color');

    caja.addEventListener('mousemove', function (e) {
        var r = caja.getBoundingClientRect();
        foto.style.setProperty('--x', (e.clientX - r.left) + 'px');
        foto.style.setProperty('--y', (e.clientY - r.top) + 'px');
        caja.classList.add('is-lens');
    });
    caja.addEventListener('mouseleave', function () { caja.classList.remove('is-lens'); });

    // En móvil: al tocar, se descubre la foto entera (y al volver a tocar, se oculta)
    caja.addEventListener('click', function () { caja.classList.toggle('is-open'); });
}

// ---------- COPIAR EMAIL ----------
function initCopyMail() {
    var btn = document.getElementById('copy-mail');
    var hint = document.getElementById('copy-hint');
    if (!btn) return;
    btn.addEventListener('click', function () {
        var mail = btn.getAttribute('data-mail');
        if (navigator.clipboard) {
            navigator.clipboard.writeText(mail).then(function () {
                hint.textContent = '¡Copiado! Te espero en el correo ✦';
                hint.style.color = 'var(--pink)';
            });
        } else {
            window.location.href = 'mailto:' + mail;
        }
    });
}

// ---------- PÁGINA DE PROYECTO ----------
function renderProyecto() {
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'), 10);
    var pos = -1;
    for (var i = 0; i < portfolioData.length; i++) {
        if (portfolioData[i].id === id) { pos = i; break; }
    }
    if (pos === -1) pos = 0;
    var cat = portfolioData[pos];
    if (!cat) return;

    document.title = cat.titulo + ' | PUCHE!';
    document.getElementById('proy-index').textContent = '(' + dosCifras(pos + 1) + ' / ' + dosCifras(portfolioData.length) + ')';
    document.getElementById('proy-title').textContent = cat.titulo;
    document.getElementById('proy-subtitle').textContent = cat.subtitulo;
    document.getElementById('proy-tags').textContent = cat.tags.join(' · ');

    var html = '';
    cat.proys.forEach(function (p, j) {
        var imgs = (p.imgs && p.imgs.length) ? p.imgs : (p.video ? [] : [{ src: p.foto, alt: p.titulo }]);
        var htmlImgs = imgs.map(function (im) {
            return '<img src="' + im.src + '" alt="' + im.alt + '" loading="lazy" onerror="this.remove()">';
        }).join('');
        // Si el proyecto tiene vídeo, va primero y con controles (sonido incluido)
        if (p.video) {
            htmlImgs = '<video src="' + p.video + '" poster="' + p.foto + '" controls playsinline preload="metadata"></video>' + htmlImgs;
        }
        html += ''
            + '<article class="pitem reveal" id="p' + j + '">'
            +   '<div class="pitem__media">' + htmlImgs + '</div>'
            +   '<div class="pitem__text">'
            +     '<span>' + dosCifras(j + 1) + '</span>'
            +     '<h2>' + p.titulo + '</h2>'
            +     '<p>' + p.descripcion + '</p>'
            +   '</div>'
            + '</article>';
    });
    document.getElementById('proy-list').innerHTML = html;

    // Enlace al siguiente proyecto (vuelve al primero al final)
    var sig = portfolioData[(pos + 1) % portfolioData.length];
    document.getElementById('proy-next').href = 'proyecto.html?id=' + sig.id;
    document.getElementById('proy-next-title').textContent = sig.titulo + ' →';

    // Compatibilidad con los enlaces antiguos tipo proyecto.html?id=1&proy=0
    var proy = params.get('proy');
    if (proy !== null) {
        var destino = document.getElementById('p' + proy);
        if (destino) setTimeout(function () { destino.scrollIntoView(); }, 100);
    }
}

// ---------- ARRANQUE ----------
document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initCursor();

    var pagina = document.body.dataset.page;
    var datos = loadPortfolio();

    if (pagina === 'index') {
        initHeroLetters();
        initManifesto();
        initServices();
        initStrip();
        initReel();
        initAboutLens();
        initCopyMail();
        // Esperamos a la vez a la animación de carga y a los datos
        var cargaLista = new Promise(function (ok) { initLoader(ok); });
        datos.then(function () {
            renderIndex();
            initReveal();
        });
        cargaLista.then(function () {});
    }

    if (pagina === 'proyecto') {
        document.body.classList.add('is-ready');
        datos.then(function () {
            renderProyecto();
            initReveal();
        });
    }
});
