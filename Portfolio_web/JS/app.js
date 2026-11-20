//   APP.JS - Portfolio de Fernando Puche

// CONSTANTES - Son valores que nunca cambian


// Logos originales de redes sociales (color rosa)
const SOCIAL_ORIG = [
    'Img/linkdngrosa.png',   // LinkedIn
    'Img/instarosa.png',     // Instagram
    'Img/facebookrosa.png'   // Facebook
];

// Logos nuevos de redes sociales (color negro)
const SOCIAL_NEW = [
    'Img/facebooknegro.png',   // Facebook
    'Img/instanegro.png',      // Instagram
    'Img/linkedingnegro.png'   // LinkedIn
];


// VARIABLE GLOBAL - Guarda los datos del portfolio


let portfolioData = null;



// FUNCIÓN: Cargar datos del portfolio


function loadPortfolio() {
    // fetch() pide datos a una URL
    // return es NECESARIO para que .then() funcione después
    return fetch('data/portfolio.json')
        .then(function(respuesta) {
            return respuesta.json();
        })
        .then(function(datos) {
            // Guardamos los datos en la variable global
            portfolioData = datos;
        })
        .catch(function(error) {
            // Si hay un error, lo mostramos en la consola
            console.log('Error al cargar portfolio');
        });
}


// Navegación (menú hamburger)


function initNav() {

    // Buscamos el elemento hamburger en la página
    var hamburger = document.getElementById('hamburger');

    // Buscamos el elemento de los links de navegación
    var navLinks = document.getElementById('nav-links');

    // Buscamos el contenedor de iconos sociales
    var socialIcons = document.getElementById('social-icons');

    // Buscamos el contenedor de los items del menú
    var menuItems = document.getElementById('menu-items');


    // Añadimos los enlaces del menú 
    
    if (menuItems !== null) {
        menuItems.innerHTML = ''
            + '<li><a href="quehago.html">QUE HAGO.</a></li>'
            + '<li><a href="quiensoy.html">QUIEN SOY.</a></li>'
            + '<li><a href="contacto.html">CONTACTO.</a></li>';
    }


    // Añadimos los iconos de redes sociales 
    
    if (socialIcons !== null) {
        socialIcons.innerHTML = ''
            + '<a href="https://www.linkedin.com/in/fernandopuche/" target="_blank" rel="noopener">'
            +     '<img src="' + SOCIAL_ORIG[0] + '" alt="LINKEDIN">'
            + '</a>'
            + '<a href="https://instagram.com/fernandopuche" target="_blank" rel="noopener">'
            +     '<img src="' + SOCIAL_ORIG[1] + '" alt="INSTAGRAM">'
            + '</a>'
            + '<a href="https://www.facebook.com/profile.php?id=100007985717152" target="_blank" rel="noopener">'
            +     '<img src="' + SOCIAL_ORIG[2] + '" alt="FACEBOOK">'
            + '</a>';
    }


    // Cuando el usuario hace clic (hamburguer)

    if (hamburger !== null) {

        hamburger.addEventListener('click', function() {

            // Toggle = si tiene la clase la quita, si no la tiene la pone
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');

            // Añadimos o quitamos la clase 'menu-open' al body
            if (hamburger.classList.contains('active')) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }

            // Cambiamos el texto del hamburger
            if (hamburger.classList.contains('active')) {
                hamburger.querySelector('span').textContent = 'CLOSE';
            } else {
                hamburger.querySelector('span').textContent = 'MENU';
            }

            // Cambiamos los iconos sociales de rosa a negro
            var imagenes = navLinks.querySelectorAll('img');
            for (var i = 0; i < imagenes.length; i++) {
                if (hamburger.classList.contains('active')) {
                    // Modo activo = iconos negros
                    imagenes[i].src = SOCIAL_NEW[i];
                } else {
                    // Modo inactivo = iconos rosas
                    imagenes[i].src = SOCIAL_ORIG[i];
                }
            }

        });
    }


    // ENLACES DEL MENÚ: Cuando el usuario hace clic en un enlace 

    var enlacesMenu = document.querySelectorAll('.menu-items a');
    for (var j = 0; j < enlacesMenu.length; j++) {
        enlacesMenu[j].addEventListener('click', function() {

            // Cerramos el menú
            if (navLinks !== null) {
                navLinks.classList.remove('active');
            }

            if (hamburger !== null) {
                hamburger.classList.remove('active');
            }

            document.body.classList.remove('menu-open');

            // Volvemos a poner el texto MENU
            if (hamburger !== null) {
                hamburger.querySelector('span').textContent = 'MENU';
            }

        });
    }

}


// FUNCIÓN: Pantalla de carga 


function initCarga() {

    // Buscamos el elemento con clase 'carga'
    var carga = document.querySelector('.carga');

    // Si existe, lo escondemos después de 1.5 segundos
    if (carga !== null) {
        setTimeout(function() {
            carga.classList.add('carga--fadeout');
        }, 1500);
    }

}



// FUNCIÓN: Renderizar página INDEX 


function renderIndex() {

    // Buscamos el contenedor del grid de proyectos
    var grid = document.getElementById('projects-grid');

    // Si no existe el grid o no hay datos, salimos
    if (grid === null) {
        return;
    }

    if (portfolioData === null) {
        return;
    }

    // Para cada categoría de proyecto, creamos una tarjeta HTML
    var htmlTarjetas = '';

    for (var i = 0; i < portfolioData.length; i++) {

        var cat = portfolioData[i];

        // Creamos el HTML de la tarjeta
        htmlTarjetas = htmlTarjetas
            + '<div class="card">'
            +     '<a href="proyecto.html?id=' + cat.id + '" class="card-link">'
            +         '<div class="card-image">'
            +             '<img src="' + cat.cover + '" alt="' + cat.titulo + '">'
            +         '</div>'
            +         '<div class="card-content">'
            +             '<div class="card-text">'
            +                 '<h3>' + cat.titulo + '</h3>'
            +                 '<p class="subtitle">' + cat.subtitulo + '</p>'
            +                 '<p class="tags">' + cat.tags.join('<br>') + '</p>'
            +             '</div>'
            +             '<span class="btn-explore">Explore</span>'
            +         '</div>'
            +     '</a>'
            + '</div>';

    }

    // Insertamos el HTML en el grid
    grid.innerHTML = htmlTarjetas;

}



// FUNCIÓN: Renderizar página PROYECTO


function renderProyecto() {

    // Obtenemos los parámetros de la URL (ejemplo: proyecto.html?id=1&proy=0)
    var params = new URLSearchParams(window.location.search);

    // Obtenemos el valor del parámetro 'id'
    var catId = parseInt(params.get('id'));

    // Buscamos la categoría que coincide con el id
    var cat = null;
    for (var i = 0; i < portfolioData.length; i++) {
        if (portfolioData[i].id === catId) {
            cat = portfolioData[i];
            break;
        }
    }

    // Si no encontramos la categoría, salimos
    if (cat === null) {
        return;
    }

    // Ponemos el título y subtítulo en la página
    var tituloEl = document.getElementById('proy-title');
    var subtituloEl = document.getElementById('proy-subtitle');

    if (tituloEl !== null) {
        tituloEl.textContent = cat.titulo;
    }

    if (subtituloEl !== null) {
        subtituloEl.textContent = cat.subtitulo;
    }

    // Obtenemos el parámetro 'proy' (índice del proyecto)
    var proyId = parseInt(params.get('proy'));

    // Si proyId es un número válido y existe el proyecto
    if (!isNaN(proyId) && cat.proys[proyId] !== undefined) {
        // Mostramos el detalle del proyecto
        renderProyDetail(cat, proyId);
    } else {
        // Mostramos el grid de proyectos
        renderProyGrid(cat);
    }

}



// FUNCIÓN: Mostrar grid de proyectos


function renderProyGrid(cat) {

    // Buscamos el contenedor del grid
    var grid = document.getElementById('proy-grid');

    if (grid === null) {
        return;
    }

    // escondemos el detalle
    var detail = document.getElementById('proy-detail');
    if (detail !== null) {
        detail.style.display = 'none';
    }

    // Creamos el HTML de cada proyecto
    var htmlTarjetas = '';

    for (var i = 0; i < cat.proys.length; i++) {
        var proy = cat.proys[i];

        htmlTarjetas = htmlTarjetas
            + '<div class="card">'
            +     '<a href="proyecto.html?id=' + cat.id + '&proy=' + i + '">'
            +         '<img src="' + proy.foto + '" alt="' + proy.titulo + '">'
            +         '<span>' + proy.titulo + '</span>'
            +     '</a>'
            + '</div>';
    }

    grid.innerHTML = htmlTarjetas;

}


// FUNCIÓN: Mostrar detalle de un proyecto


function renderProyDetail(cat, proyIdx) {

    // Obtenemos los datos del proyecto específico
    var proy = cat.proys[proyIdx];

    // Ocultamos el grid
    var grid = document.getElementById('proy-grid');
    if (grid !== null) {
        grid.style.display = 'none';
    }

    // Buscamos el contenedor del detalle
    var detail = document.getElementById('proy-detail');

    if (detail === null) {
        return;
    }

    // Mostramos el detalle
    detail.style.display = 'flex';

    // Creamos el HTML del detalle
    var html = ''
        + '<div class="image-box">'
        +     '<img src="' + proy.foto + '" alt="' + proy.titulo + '">'
        + '</div>'
        + '<div class="text-box">'
        +     '<h1>' + proy.titulo + '</h1>'
        +     '<h2>' + cat.tags.join(' - ') + '</h2>'
        +     '<p>' + proy.descripcion + '</p>';

    // Si hay más imágenes, las añadimos
    if (proy.imgs !== undefined && proy.imgs.length > 1) {
        for (var i = 1; i < proy.imgs.length; i++) {
            html = html
                + '<img src="' + proy.imgs[i].src + '" alt="' + proy.imgs[i].alt + '" style="width:100%;margin-top:1rem;border-radius:12px;">';
        }
    }

    // Botón para volver
    html = html
        + '<a href="proyecto.html?id=' + cat.id + '" style="display:inline-block;margin-top:2rem;padding:14px 45px;background:var(--color-primary);border-radius:50px;color:white;font-weight:bold;text-transform:uppercase;text-decoration:none;">← Volver</a>'
        + '</div>';

    detail.innerHTML = html;

}



// Se ejecuta cuando carga la página


document.addEventListener('DOMContentLoaded', function() {

    // Iniciamos la pantalla de carga
    initCarga();

    // Cargamos los datos del portfolio
    // Luego esperamos a que carguen para renderizar
    loadPortfolio().then(function() {

        // Iniciamos la navegación
        initNav();

        // Según la página, renderizamos el contenido
        var pagina = document.body.dataset.page;

        if (pagina === 'index') {
            renderIndex();
        }

        if (pagina === 'proyecto') {
            renderProyecto();
        }

    });

});
