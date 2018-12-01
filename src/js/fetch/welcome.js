const token = localStorage.getItem('token')
window.onload = function () {
  if (!token) {
    window.location.replace('./admin_login.html')
    // eslint-disable-next-line no-alert
    alert('Kindly login or create Account')
  }
}
