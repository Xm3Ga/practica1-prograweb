// Estado de la aplicación
let currentUser = null;
let token = localStorage.getItem('token');
let products = [];

// Referencias a elementos del DOM
const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');
const productsView = document.getElementById('productsView');
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const logoutLink = document.getElementById('logoutLink');
const productModal = document.getElementById('productModal');
const notification = document.getElementById('notification');

// API Base URL
const API_URL = '/api';

// Funciones de utilidad
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function updateNavbar() {
    if (currentUser) {
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        logoutLink.textContent = `Cerrar Sesión (${currentUser.username})`;
    } else {
        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
        logoutLink.style.display = 'none';
    }
}

function showView(view) {
    loginView.style.display = 'none';
    registerView.style.display = 'none';
    productsView.style.display = 'none';
    
    if (view === 'login') loginView.style.display = 'block';
    else if (view === 'register') registerView.style.display = 'block';
    else if (view === 'products') productsView.style.display = 'block';
}

// Verificar autenticación al cargar
async function checkAuth() {
    if (token) {
        try {
            // Decodificar el token para obtener la información del usuario
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUser = {
                id: payload.id,
                username: payload.username,
                role: payload.role
            };
            updateNavbar();
            showView('products');
            loadProducts();
            
            // Mostrar botón de agregar producto si es admin
            if (currentUser.role === 'admin') {
                document.getElementById('addProductBtn').style.display = 'inline-block';
            }
        } catch (error) {
            console.error('Token inválido:', error);
            logout();
        }
    } else {
        showView('login');
    }
}

// Funciones de autenticación
async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            currentUser = data.user;
            localStorage.setItem('token', token);
            updateNavbar();
            showView('products');
            loadProducts();
            showNotification('Inicio de sesión exitoso', 'success');
            
            if (currentUser.role === 'admin') {
                document.getElementById('addProductBtn').style.display = 'inline-block';
            }
        } else {
            showNotification(data.error || 'Error al iniciar sesión', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    }
}

async function register(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            currentUser = data.user;
            localStorage.setItem('token', token);
            updateNavbar();
            showView('products');
            loadProducts();
            showNotification('Registro exitoso', 'success');
        } else {
            showNotification(data.error || 'Error al registrar', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    }
}

function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    updateNavbar();
    showView('login');
    document.getElementById('addProductBtn').style.display = 'none';
}

// Funciones de productos
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (response.ok) {
            products = data;
            renderProducts();
        } else {
            showNotification('Error al cargar productos', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    }
}

function renderProducts() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    if (products.length === 0) {
        productsList.innerHTML = '<p class="no-products">No hay productos disponibles</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h3>${product.nombre}</h3>
            <p class="product-price">$${product.precio.toFixed(2)}</p>
            <p class="product-description">${product.descripcion}</p>
            <div class="product-info">
                <span>Stock: ${product.stock}</span>
                <span>Categoría: ${product.categoria}</span>
            </div>
            ${currentUser && currentUser.role === 'admin' ? `
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="editProduct('${product._id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Eliminar</button>
                </div>
            ` : ''}
        `;
        productsList.appendChild(productCard);
    });
}

async function saveProduct(productData) {
    try {
        const isEdit = productData.id;
        const url = isEdit ? `${API_URL}/products/${productData.id}` : `${API_URL}/products`;
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: productData.nombre,
                precio: productData.precio,
                descripcion: productData.descripcion,
                stock: productData.stock,
                categoria: productData.categoria
            })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification(isEdit ? 'Producto actualizado' : 'Producto creado', 'success');
            closeModal();
            loadProducts();
        } else {
            showNotification(data.error || 'Error al guardar producto', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showNotification('Producto eliminado', 'success');
            loadProducts();
        } else {
            const data = await response.json();
            showNotification(data.error || 'Error al eliminar producto', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    }
}

function editProduct(id) {
    const product = products.find(p => p._id === id);
    if (!product) return;

    document.getElementById('modalTitle').textContent = 'Editar Producto';
    document.getElementById('productId').value = product._id;
    document.getElementById('productName').value = product.nombre;
    document.getElementById('productPrice').value = product.precio;
    document.getElementById('productDescription').value = product.descripcion;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productCategory').value = product.categoria;
    
    openModal();
}

function openModal() {
    productModal.style.display = 'flex';
}

function closeModal() {
    productModal.style.display = 'none';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').textContent = 'Agregar Producto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Navegación
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView('login');
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView('register');
    });

    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Enlaces entre formularios
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        showView('register');
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showView('login');
    });

    // Formulario de login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        await login(username, password);
    });

    // Formulario de registro
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        await register(username, email, password);
    });

    // Botón de agregar producto
    document.getElementById('addProductBtn').addEventListener('click', () => {
        openModal();
    });

    // Modal
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('cancelModal').addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeModal();
        }
    });

    // Formulario de producto
    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const productData = {
            id: document.getElementById('productId').value,
            nombre: document.getElementById('productName').value,
            precio: parseFloat(document.getElementById('productPrice').value),
            descripcion: document.getElementById('productDescription').value,
            stock: parseInt(document.getElementById('productStock').value),
            categoria: document.getElementById('productCategory').value
        };
        await saveProduct(productData);
    });
});
