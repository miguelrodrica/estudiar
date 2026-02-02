const form = document.getElementById('loginForm')
const emailUser = document.getElementById('emailInputLogin');
const passwordUser = document.getElementById('passwordInputLogin');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    let userFound = null;

    for (let user of users) {
        if (user.email === emailUser.value) {
            userFound = user;
            break;
        }
    };

    if (!userFound) {
        alert('No existe una cuenta asociada a este email');
        return;
    }

    if (userFound.password !== passwordUser.value) {
        alert('Contraseña incorrecta');
        return;
    }

    localStorage.setItem('user', JSON.stringify(userFound));

    if (userFound.role === 'admin') {
        window.location.href = './admin.html';
    } else {
        window.location.href = './shop.html';
    }
});