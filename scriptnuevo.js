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

/*--------------------detalle (modal) --------------------*/

const modalDetalle = document.getElementById("modal-detalle");
const modalImagen = document.getElementById("modal-imagen");
const modalNombre = document.getElementById("modal-nombre");
const modalDescripcion = document.getElementById("modal-descripcion");
const modalPrecio = document.getElementById("modal-precio");
const modalCerrar = document.getElementById("modal-cerrar");

function abrirModal(producto) {

    const nombre = producto.querySelector("h3").textContent.trim();
    const descripcion = producto.querySelector("p").textContent.trim();
    const precioTexto = producto.querySelector(".precio").textContent.trim();
    const imagen = producto.querySelector("img").src;

    modalNombre.textContent = nombre;
    modalDescripcion.textContent = descripcion;
    modalPrecio.textContent = precioTexto;
    modalImagen.src = imagen;
    modalImagen.alt = nombre;

    productoActual = {
        nombre: nombre,
        precio: parsearPrecio(precioTexto),
        imagen: imagen
    };

    modalDetalle.classList.add("activo");
    document.body.classList.add("modal-abierto");
}

function cerrarModal() {

    modalDetalle.classList.remove("activo");
    document.body.classList.remove("modal-abierto");
}

document.querySelectorAll(".btn-detalle").forEach(function(boton) {

    boton.addEventListener("click", function() {

        const producto = boton.closest(".producto");
        abrirModal(producto);

    });

});

// Cerrar con el botón de la "x"
modalCerrar.addEventListener("click", cerrarModal);

// Cerrar al hacer clic fuera del contenido del modal
modalDetalle.addEventListener("click", function(evento) {

    if (evento.target === modalDetalle) {
        cerrarModal();
    }

});

// Cerrar con la tecla Escape
document.addEventListener("keydown", function(evento) {

    if (evento.key !== "Escape") {
        return;
    }

    if (modalDetalle.classList.contains("activo")) {
        cerrarModal();
    }

    if (modalLogin && modalLogin.classList.contains("activo")) {
        cerrarModalLogin();
    }

    if (modalRegistro && modalRegistro.classList.contains("activo")) {
        cerrarModalRegistro();
    }

    if (modalCerrarSesion && modalCerrarSesion.classList.contains("activo")) {
        cerrarModalCerrarSesion();
    }

    if (modalEliminarProducto && modalEliminarProducto.classList.contains("activo")) {
        cerrarModalEliminarProducto();
    }

});

/*--------------------resumen del pedido --------------------*/

const PEDIDO_STORAGE_KEY = "coffeeHempanyPedido";

const resumenLista = document.getElementById("resumen-lista");
const resumenVacio = document.getElementById("resumen-vacio");
const resumenSubtotal = document.getElementById("resumen-subtotal");
const resumenTotal = document.getElementById("resumen-total");
const modalAgregar = document.getElementById("modal-agregar");

let pedido = JSON.parse(localStorage.getItem(PEDIDO_STORAGE_KEY)) || [];
let productoActual = null;

function parsearPrecio(texto) {

    const numero = texto.replace(/[^\d]/g, "");
    return parseInt(numero, 10) || 0;
}

function formatearPrecio(numero) {

    return "$" + numero.toLocaleString("es-CO");
}

function guardarPedidoEnStorage() {

    localStorage.setItem(PEDIDO_STORAGE_KEY, JSON.stringify(pedido));
}

function agregarAlPedido(producto) {

    const existente = pedido.find(function(item) {
        return item.nombre === producto.nombre;
    });

    if (existente) {
        existente.cantidad += 1;
    } else {
        pedido.push({
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarPedidoEnStorage();
    renderizarResumen();
}

function renderizarResumen() {

    // El resumen del pedido ahora vive en pedido.html;
    // en index.html estos elementos no existen.
    if (!resumenLista) {
        return;
    }

    resumenLista.innerHTML = "";

    if (pedido.length === 0) {

        resumenVacio.style.display = "block";
        resumenLista.appendChild(resumenVacio);

        resumenSubtotal.textContent = formatearPrecio(0);
        resumenTotal.textContent = formatearPrecio(0);

        return;
    }

    let subtotal = 0;

    pedido.forEach(function(item) {

        const totalItem = item.precio * item.cantidad;
        subtotal += totalItem;

        const articulo = document.createElement("article");
        articulo.className = "producto-pedido";

        articulo.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="producto-pedido-info">
                <h4>${item.nombre}</h4>
                <p>Cantidad: ${item.cantidad}</p>
                <span>${formatearPrecio(totalItem)}</span>
            </div>
        `;

        resumenLista.appendChild(articulo);

    });

    resumenSubtotal.textContent = formatearPrecio(subtotal);
    resumenTotal.textContent = formatearPrecio(subtotal);
}

if (modalAgregar) {

    modalAgregar.addEventListener("click", function() {

        if (!productoActual) {
            return;
        }

        agregarAlPedido(productoActual);

        const textoOriginal = modalAgregar.textContent;
        modalAgregar.textContent = "¡Agregado!";
        modalAgregar.disabled = true;

        setTimeout(function() {

            modalAgregar.textContent = textoOriginal;
            modalAgregar.disabled = false;
            cerrarModal();

            window.open("pedido.html", "_blank");

        }, 700);

    });

}

renderizarResumen();

/*--------------------productos agregados por el admin (persistentes) --------------------*/

const PRODUCTOS_EXTRA_KEY = "coffeeHempanyProductosExtra";

function obtenerProductosExtra() {

    try {
        return JSON.parse(localStorage.getItem(PRODUCTOS_EXTRA_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function guardarProductosExtra(lista) {
    localStorage.setItem(PRODUCTOS_EXTRA_KEY, JSON.stringify(lista));
}

/*--------------------buscador de productos --------------------*/

const btnBuscar = document.getElementById("btn-buscar");
const inputBuscar = document.getElementById("input-buscar");
const sinResultados = document.getElementById("sin-resultados");

function abrirBuscador() {

    if (!inputBuscar) {
        return;
    }

    inputBuscar.classList.add("activo");
    inputBuscar.focus();

    const seccionMenu = document.getElementById("menu");

    if (seccionMenu) {
        seccionMenu.scrollIntoView({ behavior: "smooth" });
    }
}

function cerrarBuscador() {

    if (!inputBuscar) {
        return;
    }

    inputBuscar.classList.remove("activo");
    inputBuscar.value = "";

    filtrarProductos("");
}

function filtrarProductos(texto) {

    const termino = texto.trim().toLowerCase();
    const productosLista = document.querySelectorAll(".productos .producto");

    let coincidencias = 0;

    productosLista.forEach(function(producto) {

        const nombre = producto.querySelector("h3").textContent.trim().toLowerCase();
        const descripcion = producto.querySelector("p").textContent.trim().toLowerCase();

        const coincide = nombre.includes(termino) || descripcion.includes(termino);

        producto.style.display = coincide ? "" : "none";

        if (coincide) {
            coincidencias += 1;
        }

    });

    if (sinResultados) {

        if (termino !== "" && coincidencias === 0) {
            sinResultados.classList.add("activo");
        } else {
            sinResultados.classList.remove("activo");
        }

    }

}

if (btnBuscar) {

    btnBuscar.addEventListener("click", function() {

        if (inputBuscar.classList.contains("activo")) {
            cerrarBuscador();
        } else {
            abrirBuscador();
        }

    });

}

if (inputBuscar) {

    inputBuscar.addEventListener("input", function() {

        filtrarProductos(inputBuscar.value);

    });

    inputBuscar.addEventListener("keydown", function(evento) {

        if (evento.key === "Escape") {
            cerrarBuscador();
        }

    });

}

// Cerrar el buscador al hacer clic fuera de él (solo si está vacío)

document.addEventListener("click", function(evento) {

    if (!btnBuscar || !inputBuscar) {
        return;
    }

    const clicFuera = !evento.target.closest(".buscador");

    if (clicFuera && inputBuscar.classList.contains("activo") && inputBuscar.value.trim() === "") {
        cerrarBuscador();
    }

});

/*--------------------carrito (header) --------------------*/

const btnCarrito = document.getElementById("btn-carrito");

if (btnCarrito) {

    btnCarrito.addEventListener("click", function() {

        window.location.href = "pedido.html";

    });

}

/*--------------------eliminar producto (doble clic en la imagen) --------------------*/

const modalEliminarProducto = document.getElementById("modal-eliminar-producto");
const eliminarProductoNombre = document.getElementById("eliminar-producto-nombre");
const btnCancelarEliminarProducto = document.getElementById("btn-cancelar-eliminar-producto");
const btnConfirmarEliminarProducto = document.getElementById("btn-confirmar-eliminar-producto");

let productoAEliminar = null;

function abrirModalEliminarProducto(producto) {

    if (!modalEliminarProducto) {
        return;
    }

    productoAEliminar = producto;

    const nombre = producto.querySelector("h3").textContent.trim();

    if (eliminarProductoNombre) {
        eliminarProductoNombre.textContent = nombre;
    }

    modalEliminarProducto.classList.add("activo");
    document.body.classList.add("modal-abierto");
}

function cerrarModalEliminarProducto() {

    if (!modalEliminarProducto) {
        return;
    }

    modalEliminarProducto.classList.remove("activo");
    document.body.classList.remove("modal-abierto");

    productoAEliminar = null;
}

// Doble clic en la imagen de cualquier producto (incluye los agregados por el admin)

const listaDeProductos = document.querySelector(".productos");

if (listaDeProductos) {

    listaDeProductos.addEventListener("dblclick", function(evento) {

        const imagen = evento.target.closest(".producto-imagen");

        if (!imagen) {
            return;
        }

        const producto = imagen.closest(".producto");

        if (producto) {
            abrirModalEliminarProducto(producto);
        }

    });

}

if (btnCancelarEliminarProducto) {

    btnCancelarEliminarProducto.addEventListener("click", cerrarModalEliminarProducto);

}

// Cerrar al hacer clic fuera del contenido del modal

if (modalEliminarProducto) {

    modalEliminarProducto.addEventListener("click", function(evento) {

        if (evento.target === modalEliminarProducto) {
            cerrarModalEliminarProducto();
        }

    });

}

if (btnConfirmarEliminarProducto) {

    btnConfirmarEliminarProducto.addEventListener("click", function() {

        if (productoAEliminar) {

            const nombreExtra = productoAEliminar.getAttribute("data-producto-extra");

            if (nombreExtra) {

                const productosGuardados = obtenerProductosExtra().filter(function(item) {
                    return item.nombre !== nombreExtra;
                });

                guardarProductosExtra(productosGuardados);

            }

            productoAEliminar.remove();

        }

        cerrarModalEliminarProducto();

    });

}

/*--------------------login / registro --------------------*/

const modalLogin = document.getElementById("modal-login");
const modalLoginCerrar = document.getElementById("modal-login-cerrar");
const formLogin = document.getElementById("form-login");
const loginMensaje = document.getElementById("login-mensaje");
const linkAbrirRegistro = document.getElementById("link-abrir-registro");

const modalRegistro = document.getElementById("modal-registro");
const modalRegistroCerrar = document.getElementById("modal-registro-cerrar");
const formRegistro = document.getElementById("form-registro");
const registroMensaje = document.getElementById("registro-mensaje");
const linkAbrirLogin = document.getElementById("link-abrir-login");

/*--------------------usuarios y sesión (guardados en el navegador) --------------------*/

const USUARIOS_STORAGE_KEY = "coffeeHempanyUsuarios";
const SESION_STORAGE_KEY = "coffeeHempanySesion";

function obtenerUsuarios() {

    try {
        return JSON.parse(localStorage.getItem(USUARIOS_STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function guardarUsuarios(lista) {
    localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(lista));
}

function buscarUsuarioPorCorreo(correo) {

    const usuarios = obtenerUsuarios();

    return usuarios.find(function(usuario) {
        return usuario.correo.toLowerCase() === correo.toLowerCase();
    }) || null;
}

function abrirModalLogin() {

    if (!modalLogin) {
        return;
    }

    modalLogin.classList.add("activo");
    document.body.classList.add("modal-abierto");
}

function cerrarModalLogin() {

    if (!modalLogin) {
        return;
    }

    modalLogin.classList.remove("activo");
    document.body.classList.remove("modal-abierto");
}

function abrirModalRegistro() {

    if (!modalRegistro) {
        return;
    }

    modalRegistro.classList.add("activo");
    document.body.classList.add("modal-abierto");
}

function cerrarModalRegistro() {

    if (!modalRegistro) {
        return;
    }

    modalRegistro.classList.remove("activo");
    document.body.classList.remove("modal-abierto");
}

if (modalLoginCerrar) {
    modalLoginCerrar.addEventListener("click", cerrarModalLogin);
}

if (modalLogin) {

    modalLogin.addEventListener("click", function(evento) {

        if (evento.target === modalLogin) {
            cerrarModalLogin();
        }

    });

}

if (modalRegistroCerrar) {
    modalRegistroCerrar.addEventListener("click", cerrarModalRegistro);
}

if (modalRegistro) {

    modalRegistro.addEventListener("click", function(evento) {

        if (evento.target === modalRegistro) {
            cerrarModalRegistro();
        }

    });

}

// Pasar de login a registro y viceversa

if (linkAbrirRegistro) {

    linkAbrirRegistro.addEventListener("click", function(evento) {

        evento.preventDefault();
        cerrarModalLogin();
        abrirModalRegistro();

    });

}

if (linkAbrirLogin) {

    linkAbrirLogin.addEventListener("click", function(evento) {

        evento.preventDefault();
        cerrarModalRegistro();
        abrirModalLogin();

    });

}

// Enviar el formulario de inicio de sesión

if (formLogin) {

    formLogin.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const correoIngresado = document.getElementById("login-correo").value.trim();
        const usuarioEncontrado = buscarUsuarioPorCorreo(correoIngresado);

        const sesion = {
            nombre: usuarioEncontrado ? usuarioEncontrado.nombre : correoIngresado.split("@")[0],
            correo: correoIngresado
        };

        localStorage.setItem(SESION_STORAGE_KEY, JSON.stringify(sesion));

        cerrarModalLogin();
        formLogin.reset();
        loginMensaje.textContent = "";
        loginMensaje.className = "modal-login-mensaje";

        window.location.href = "admin.html";

    });

}

// Enviar el formulario de registro

if (formRegistro) {

    formRegistro.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const nombre = document.getElementById("registro-nombre").value.trim();
        const correo = document.getElementById("registro-correo").value.trim();
        const password = document.getElementById("registro-password").value;
        const confirmar = document.getElementById("registro-confirmar").value;

        if (password !== confirmar) {

            registroMensaje.textContent = "Las contraseñas no coinciden.";
            registroMensaje.className = "modal-login-mensaje error";
            return;

        }

        const usuarios = obtenerUsuarios();

        const yaExiste = usuarios.some(function(usuario) {
            return usuario.correo.toLowerCase() === correo.toLowerCase();
        });

        if (!yaExiste) {

            usuarios.push({ nombre: nombre, correo: correo, contrasena: password });
            guardarUsuarios(usuarios);

        }

        formRegistro.reset();
        registroMensaje.textContent = "";
        registroMensaje.className = "modal-login-mensaje";

        cerrarModalRegistro();
        abrirModalLogin();

        loginMensaje.textContent = "Cuenta creada correctamente. Ahora inicia sesión.";
        loginMensaje.className = "modal-login-mensaje exito";

    });

}

/*--------------------panel de administrador --------------------*/

const btnIniciarSesion = document.getElementById("btn-iniciar-sesion");
const formAdminProducto = document.getElementById("form-admin-producto");
const adminImagenInput = document.getElementById("admin-imagen");
const adminImagenVista = document.getElementById("admin-imagen-vista");
const adminMensaje = document.getElementById("admin-mensaje");
const btnCerrarSesionAdmin = document.getElementById("btn-cerrar-sesion-admin");
const contenedorProductos = document.querySelector(".productos");

const modalCerrarSesion = document.getElementById("modal-cerrar-sesion");
const btnCancelarCerrarSesion = document.getElementById("btn-cancelar-cerrar-sesion");
const btnConfirmarCerrarSesion = document.getElementById("btn-confirmar-cerrar-sesion");

let imagenProductoNueva = "";

function abrirModalCerrarSesion() {

    if (!modalCerrarSesion) {
        return;
    }

    modalCerrarSesion.classList.add("activo");
    document.body.classList.add("modal-abierto");
}

function cerrarModalCerrarSesion() {

    if (!modalCerrarSesion) {
        return;
    }

    modalCerrarSesion.classList.remove("activo");
    document.body.classList.remove("modal-abierto");
}

if (btnIniciarSesion) {

    btnIniciarSesion.addEventListener("click", function() {
        abrirModalLogin();
    });

}

if (btnCerrarSesionAdmin) {

    btnCerrarSesionAdmin.addEventListener("click", function() {

        abrirModalCerrarSesion();

    });

}

// Cancelar el cierre de sesión: vuelve al panel de administrador

if (btnCancelarCerrarSesion) {

    btnCancelarCerrarSesion.addEventListener("click", cerrarModalCerrarSesion);

}

// Cerrar al hacer clic fuera del contenido del modal

if (modalCerrarSesion) {

    modalCerrarSesion.addEventListener("click", function(evento) {

        if (evento.target === modalCerrarSesion) {
            cerrarModalCerrarSesion();
        }

    });

}

// Confirmar el cierre de sesión

if (btnConfirmarCerrarSesion) {

    btnConfirmarCerrarSesion.addEventListener("click", function() {

        cerrarModalCerrarSesion();

        localStorage.removeItem(SESION_STORAGE_KEY);

        window.location.href = "index.html";

    });

}

// Vista previa de la imagen seleccionada

if (adminImagenInput) {

    adminImagenInput.addEventListener("change", function() {

        const archivo = adminImagenInput.files[0];

        if (!archivo) {
            imagenProductoNueva = "";
            adminImagenVista.innerHTML = "<span>Sin imagen seleccionada</span>";
            return;
        }

        const lector = new FileReader();

        lector.onload = function(evento) {

            imagenProductoNueva = evento.target.result;
            adminImagenVista.innerHTML = `<img src="${imagenProductoNueva}" alt="Vista previa del producto">`;

        };

        lector.readAsDataURL(archivo);

    });

}

// Crear y agregar el nuevo producto al menú

function crearProductoEnMenu(datos, persistir) {

    if (!contenedorProductos) {
        return;
    }

    const articulo = document.createElement("article");
    articulo.className = "producto";
    articulo.setAttribute("data-categoria", datos.categoria);
    articulo.setAttribute("data-producto-extra", datos.nombre);

    articulo.innerHTML = `
        <div class="producto-imagen">
            <img src="${datos.imagen}" alt="${datos.nombre}">
        </div>
        <div class="producto-informacion">
            <h3>${datos.nombre}</h3>
            <p>${datos.descripcion}</p>
            <span class="precio">${formatearPrecio(datos.precio)}</span>
            <button class="btn-detalle">Ver detalle</button>
        </div>
    `;

    const botonDetalle = articulo.querySelector(".btn-detalle");

    botonDetalle.addEventListener("click", function() {
        abrirModal(articulo);
    });

    contenedorProductos.appendChild(articulo);

    if (persistir !== false) {

        const productosGuardados = obtenerProductosExtra();
        productosGuardados.push(datos);
        guardarProductosExtra(productosGuardados);

    }
}

// Vuelve a mostrar, al cargar la página, los productos que el
// administrador ya había agregado en una sesión anterior.

function cargarProductosGuardados() {

    const productosGuardados = obtenerProductosExtra();

    productosGuardados.forEach(function(datos) {
        crearProductoEnMenu(datos, false);
    });
}

cargarProductosGuardados();

if (formAdminProducto) {

    formAdminProducto.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const nombre = document.getElementById("admin-nombre").value.trim();
        const descripcion = document.getElementById("admin-descripcion").value.trim();
        const precio = parseInt(document.getElementById("admin-precio").value, 10);
        const categoria = document.getElementById("admin-categoria").value;

        if (!nombre || !descripcion || !precio) {

            adminMensaje.textContent = "Completa todos los campos obligatorios.";
            adminMensaje.className = "admin-mensaje error";
            return;

        }

        const imagenFinal = imagenProductoNueva || "https://via.placeholder.com/400x300?text=Sin+imagen";

        crearProductoEnMenu({
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            categoria: categoria,
            imagen: imagenFinal
        });

        adminMensaje.textContent = "Producto agregado correctamente.";
        adminMensaje.className = "admin-mensaje exito";

        formAdminProducto.reset();
        imagenProductoNueva = "";
        adminImagenVista.innerHTML = "<span>Sin imagen seleccionada</span>";

        setTimeout(function() {
            adminMensaje.textContent = "";
            adminMensaje.className = "admin-mensaje";
        }, 2500);

    });

}

/*--------------------resumen del pedido dentro del panel de administrador --------------------*/

const formPedidoResumen = document.getElementById("form-pedido");

if (formPedidoResumen) {

    formPedidoResumen.addEventListener("submit", function(evento) {

        evento.preventDefault();

        if (pedido.length === 0) {

            alert("El pedido está vacío. Agrega productos desde la pestaña 'Ver menú'.");
            return;

        }

        alert("¡Gracias! El pedido fue confirmado.");

        pedido = [];
        guardarPedidoEnStorage();
        renderizarResumen();

        formPedidoResumen.reset();

        const botonTabMenu = document.querySelector('.admin-tab-btn[data-tab="menu"]');

        if (botonTabMenu) {
            botonTabMenu.click();
        }

    });

}
