/*--------------------resumen del pedido (página independiente) --------------------*/

const PEDIDO_STORAGE_KEY = "coffeeHempanyPedido";

const resumenLista = document.getElementById("resumen-lista");
const resumenVacio = document.getElementById("resumen-vacio");
const resumenSubtotal = document.getElementById("resumen-subtotal");
const resumenTotal = document.getElementById("resumen-total");
const formPedido = document.getElementById("form-pedido");

function formatearPrecio(numero) {

    return "$" + numero.toLocaleString("es-CO");
}

function obtenerPedido() {

    try {

        return JSON.parse(localStorage.getItem(PEDIDO_STORAGE_KEY)) || [];

    } catch (error) {

        return [];

    }

}

function renderizarResumen() {

    const pedido = obtenerPedido();

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

renderizarResumen();

// Confirmar el pedido

if (formPedido) {

    formPedido.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const pedido = obtenerPedido();

        if (pedido.length === 0) {

            alert("Tu pedido está vacío. Agrega productos desde el menú antes de confirmar.");
            return;

        }

        alert("¡Gracias! Tu pedido fue confirmado.");

        localStorage.removeItem(PEDIDO_STORAGE_KEY);

        window.location.href = "index.html";

    });

}
