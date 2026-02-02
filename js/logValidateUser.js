const user = JSON.parse(localStorage.getItem('user'));

if (!user || user.role !== 'user') {
    window.location.href = './login.html';
}