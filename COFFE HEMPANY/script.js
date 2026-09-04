// ========================================
// CARRUSEL PRINCIPAL
// ========================================

let posicionCarrusel = 0;

function moverCarrusel(direccion) {

    const carrusel =
        document.getElementById("carrusel");

    if (!carrusel) {
        return;
    }

    const imagenes =
        carrusel.querySelectorAll(
            ".hero-carrusel-item"
        );

    const totalImagenes =
        imagenes.length;


    posicionCarrusel += direccion;


    if (posicionCarrusel < 0) {

        posicionCarrusel =
            totalImagenes - 1;

    }


    if (posicionCarrusel >= totalImagenes) {

        posicionCarrusel = 0;

    }


    carrusel.style.transform =
        `translateX(-${posicionCarrusel * 100}%)`;
}


// Cambiar automáticamente cada 4 segundos

setInterval(function () {

    moverCarrusel(1);

}, 4000);

/*--------------------detalle --------------------*/
document.querySelectorAll(".btn-detalle").forEach(function(boton) {

    boton.addEventListener("click", function() {

        const producto = boton.closest(".producto");

        const nombre = producto.querySelector("h3").textContent.trim();
        const descripcion = producto.querySelector("p").textContent.trim();
        const precio = producto.querySelector(".precio").textContent.trim();
        const imagen = producto.querySelector("img").src;

        localStorage.setItem("productoSeleccionado", JSON.stringify({
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            imagen: imagen
        }));

        window.open("detalle.html", "_blank");

    });

});