const form = document.querySelector('#createProductForm');
const idProduct = document.querySelector('#productId');
const nameProduct = document.querySelector('#productName');
const priceProduct = document.querySelector('#productPrice');
const categoryProduct = document.querySelector('#productCategory');
const stockProduct = document.querySelector('#productStock');
const descriptionProduct = document.querySelector('#productDescription');
const imageProduct = document.querySelector('#productImage');
const btnCreateProduct = document.querySelector('#btnCreateProduct');
const productList = document.querySelector('#productList');
// Variable de control para saber si estoy editando
let editingProductId = null;

// SUBMIT FORM (Decide POST o PUT)
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (editingProductId === null) {
        await createProduct();
    } else {
        await updateProduct();
    }

    form.reset();
    getProducts();
});

// CREATE - POST
async function createProduct() {
    const response = await fetch('http://localhost:3000/products');
    const products = await response.json();
    let idExists = false;

    for (let product of products) {
        if (product.id === idProduct.value) {
            idExists = true;
            break;
        }
    }

    if (idExists) {
        alert('Este ID de producto ya está registrado');
        return;
    }

    const newProduct = {
        id: idProduct.value,
        name: nameProduct.value,
        price: Number(priceProduct.value),
        description: descriptionProduct.value,
        image: imageProduct.value,
        category: categoryProduct.value,
        stock: Number(stockProduct.value)
    };

    await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
    });

    alert('Producto creado correctamente');
};

// READ - GET
async function getProducts() {
    const response = await fetch('http://localhost:3000/products');
    const products = await response.json();

    productList.innerHTML = '';

    for (let product of products) {
        productList.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="loadProduct('${product.id}')">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    };
};
getProducts();

// LOAD PRODUCT (para editar)
async function loadProduct(id) {
    const response = await fetch(`http://localhost:3000/products/${id}`);
    const product = await response.json();

    idProduct.value = product.id;
    nameProduct.value = product.name;
    priceProduct.value = product.price;
    categoryProduct.value = product.category;
    stockProduct.value = product.stock;
    descriptionProduct.value = product.description;
    imageProduct.value = product.image;

    editingProductId = product.id;
    idProduct.disabled = true;
    btnCreateProduct.textContent = 'Actualizar Producto';
};

// UPDATE - PUT
async function updateProduct() {
    const updatedProduct = {
        id: idProduct.value,
        name: nameProduct.value,
        price: Number(priceProduct.value),
        description: descriptionProduct.value,
        image: imageProduct.value,
        category: categoryProduct.value,
        stock: Number(stockProduct.value)
    };

    await fetch(`http://localhost:3000/products/${editingProductId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    });

    alert('Producto actualizado correctamente');

    editingProductId = null;
    idProduct.disabled = false;
    btnCreateProduct.textContent = 'Guardar Producto';
};

// DELETE
async function deleteProduct(id) {
    const confirmDelete = confirm('¿Seguro que deseas eliminar este producto?');

    if (!confirmDelete) {
        return;
    }

    await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE'
    });

    alert('Producto eliminado correctamente');
    getProducts();
};
