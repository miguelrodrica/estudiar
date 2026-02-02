const form = document.querySelector('#createProductForm');
const idProduct = document.querySelector('#productId');
const nameProduct = document.querySelector('#productName');
const priceProduct = document.querySelector('#productPrice');
const categoryProduct = document.querySelector('#productCategory');
const stockProduct = document.querySelector('#productStock');
const descriptionProduct = document.querySelector('#productDescription');
const imageProduct = document.querySelector('#productImage');
const btnCreateProduct = document.querySelector('#btnCreateProduct');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/products');
    const products = await response.json();
    let idExists = false;

    for (let product of products) {
        if (product.id === idProduct.value) {
            idExists = true;
            break;
        }
    };

    if (idExists) {
        alert('Este ID de producto ya está registrado');
        return;
    };
    
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

    alert('Producto registrado correctamente');
    form.reset();
});