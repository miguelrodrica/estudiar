let cart = JSON.parse(localStorage.getItem('cart')) || [];
const confirmOrderBtn = document.getElementById('confirmOrderBtn');
const orderTotal = document.getElementById('orderTotal');

renderCards();

async function renderCards() {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = '';

    try {
        const response = await fetch("http://localhost:3000/products");
        const products = await response.json();

        for (let product of products) {
            container.innerHTML += `
                <div class="col-md-4">
                    <div class="card text-center mb-3">
                        <img src="${product.image}" class="card-img-top" style="height: 190px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="fw-bold text-success">$${product.price}</p>
                            <p class="card-text">${product.description}</p>
                            <button class="btn btn-outline-success"
                                onclick="addToCart('${product.id}', '${product.name}', ${product.price})">
                                <i class="bi bi-cart-plus"></i>
                                Add to order
                            </button>
                        </div>
                    </div>
                </div>
            `;
        };
    } catch (error) {
        console.error(error);
        alert('Error al cargar los productos');
    };
};

function addToCart(id, name, price) {
    let productFound = null;

    for (let item of cart) {
        if (item.id === id) {
            productFound = item;
            break;
        }
    }

    if (productFound) {
        productFound.quantity += 1;
        productFound.subtotal = productFound.quantity * productFound.price;
    } else {
        const newItem = {
            id: id,
            name: name,
            price: price,
            quantity: 1,
            subtotal: price
        };

        cart.push(newItem);
    };

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

function renderCart() {
    const asideOrderBody = document.getElementById('asideOrderBody');
    asideOrderBody.innerHTML = '';

    let total = 0;

    for (let item of cart) {
        total += item.subtotal;

        asideOrderBody.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>
                    ${item.name} x${item.quantity} - $${item.subtotal.toFixed(2)}
                </span>
                <button class="btn btn-sm btn-danger"
                    onclick="removeFromCart('${item.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    }

    orderTotal.textContent = `Total: $${total.toFixed(2)}`;
};

renderCart();

function removeFromCart(id) {
    let newCart = [];

    for (let item of cart) {
        if (item.id !== id) {
            newCart.push(item);
        }
    };

    cart = newCart;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

confirmOrderBtn.addEventListener('click', confirmOrder);

async function confirmOrder() {

    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        alert('Debes iniciar sesión');
        return;
    }

    let total = 0;

    for (let item of cart) {
        total += item.subtotal;
    }

    const newOrder = {
        userId: user.id,
        items: cart,
        total: total,
        status: 'pending',
        date: new Date().toISOString()
    };

    try {
        await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOrder)
        });

        alert('Orden creada correctamente');

        cart = [];
        localStorage.removeItem('cart');
        renderCart();

    } catch (error) {
        console.error(error);
        alert('Error al crear la orden');
    }
};
