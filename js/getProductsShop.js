renderCards();

async function renderCards() {
    const container = document.getElementById("cardsContainer");

    const response = await fetch("http://localhost:3000/products");
    const products = await response.json();

    products.forEach(product => {
        container.innerHTML += `
        <div class="col">
            <div class="card text-center mb-3" style="width: 18rem;">
                <img src="${product.image}" class="card-img-top" style="height: 190px; object-fit: cover;" alt="burguer-one">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text fw-bold" style="color: green">${product.price}</p>
                    <p class="card-text">${product.description}</p>
                    <a href="#" class="btn btn-outline-success">
                        <i class="bi bi-cart-plus"></i>
                        Add to order
                    </a>
                </div>
            </div>
        </div>`
    });
}