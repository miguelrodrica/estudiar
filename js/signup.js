const form = document.querySelector('#signupForm');
const nameUser = document.querySelector('#nameInputSignUp');
const emailUser = document.querySelector('#emailInputSignUp');
const passwordUser = document.querySelector('#passwordInputSignUp');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    let emailExists = false;

    for (let user of users) {
        if (user.email === emailUser.value) {
            emailExists = true;
            break;
        }
    };

    if (emailExists) {
        alert('Este email ya está registrado');
        return;
    };
    
    const newUser = {
        name: nameUser.value,
        email: emailUser.value,
        password: passwordUser.value,
        role: "user"
    };

    await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    });

    alert('Usuario registrado correctamente');
    form.reset();
});