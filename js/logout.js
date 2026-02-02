const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = './login.html';
});