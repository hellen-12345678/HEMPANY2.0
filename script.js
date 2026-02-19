let products = [
    { id: 1, name: 'Sándwich de Jamón y Queso', price: 6500, image: 'https://cocina-familiar.com/wp-content/uploads/2023/04/sandwich-de-huevo-con-jamon-y-queso.jpg', quantity: 20 },
    { id: 2, name: 'Jugo de Naranja Natural', price: 4000, image: 'https://media.istockphoto.com/id/152971676/es/foto/jugo-de-naranja.jpg?s=612x612&w=0&k=20&c=LswF1tWPsJS6Cja9cCQ4ae7urJmqnjew7nZgGSvt1DQ=', quantity: 30 },
    { id: 3, name: 'Galletas de Chocolate', price: 1500, image: 'https://mojo.generalmills.com/api/public/content/3Wt-TSe6c0a57iCvwOTXtQ_gmi_hi_res_jpeg.jpeg?v=bd45f6e7&t=16e3ce250f244648bef28c5949fb99ff', quantity: 40 },
    { id: 4, name: 'Agua Embotellada', price: 2000, image: 'https://i.blogs.es/f1e62f/botella-agua/450_1000.webp', quantity: 50 }
];

let cart = {};
let isLoggedIn = false;
let username = null;

function showForm(formId) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    const form = document.getElementById(formId);
    if (form) {
        form.style.display = 'block';
    }
}

function login() {
    username = document.getElementById('login-username').value;
    let password = document.getElementById('login-password').value;
    if(username && password){
        isLoggedIn = true;
        alert('¡Bienvenido, '+username+'!');
        updateUI();
    } else {
        alert('Por favor, introduce usuario y contraseña.');
    }
}

function register() {
    let username = document.getElementById('register-username').value;
    let password = document.getElementById('register-password').value;
    if(username && password){
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        showForm('login-form');
    } else {
        alert('Por favor, introduce usuario y contraseña.');
    }
}

function logout() {
    isLoggedIn = false;
    username = null;
    cart = {};
    updateUI();
    alert('Sesión cerrada.');
}

function addToCart(productId){
    if(!isLoggedIn){
        alert('Por favor, inicia sesión para comprar.');
        return;
    }

    let product = products.find(p => p.id === productId);
    if(product && product.quantity > 0){
        if(cart[productId]){
            cart[productId].quantity++;
        } else {
            cart[productId] = { product: product, quantity: 1 };
        }
        product.quantity--;
        updateProductList();
        generateInventory();
    } else {
        alert('Producto agotado.');
    }
}

function updateProductList(){
    let productListDiv = document.getElementById('product-list');
    if (!productListDiv) return;
    
    productListDiv.innerHTML = '';

    products.forEach(product => {
        let productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.quantity}</p>
            <button onclick="addToCart(${product.id})" ${product.quantity === 0 ? 'disabled' : ''}>
                ${product.quantity === 0 ? 'Agotado' : 'Añadir al carrito'}
            </button>
        `;
        productListDiv.appendChild(productDiv);
    });
}

function generateInventory(){
    let inventoryTableBody = document.querySelector('#inventory-table tbody');
    if (!inventoryTableBody) return;
    
    inventoryTableBody.innerHTML = '';

    let dailySales = {};
    let totalSold = 0;

    for(let id in cart){
        if(cart.hasOwnProperty(id)){
            let item = cart[id];
            
            // Check if product is defined to avoid errors
            if (item.product) {
                 if (dailySales[item.product.name]) {
                    dailySales[item.product.name] += item.quantity;
                 } else {
                    dailySales[item.product.name] = item.quantity;
                 }
                 totalSold += item.product.price * item.quantity;
            }
        }
    }

    for(let productName in dailySales){
        let row = inventoryTableBody.insertRow();
        row.insertCell(0).textContent = productName;
        row.insertCell(1).textContent = dailySales[productName];
    }

    const totalSoldElement = document.getElementById('total-sold');
    if (totalSoldElement) {
        totalSoldElement.textContent = 'Total Vendido: $' + totalSold;
    }
}

function updateUI(){
    // Helper to safely set style
    const setDisplay = (id, value) => {
        const el = document.getElementById(id);
        if(el) el.style.display = value;
    };
    
    const productList = document.getElementById('product-list');
    
    if(isLoggedIn){
        setDisplay('login-form', 'none');
        setDisplay('register-form', 'none');
        setDisplay('inventory', 'block');
        updateProductList();
        generateInventory();
    } else {
        if (productList) productList.innerHTML = '';
        setDisplay('inventory', 'none');
        showForm('login-form');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});
