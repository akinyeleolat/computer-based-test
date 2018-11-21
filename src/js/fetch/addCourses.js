const token = localStorage.getItem('token')
const addCourses = (event) => {
  event.preventDefault()
  //  get form input
  const courseTitle = document.getElementById('courseTitle').value.trim()
  if (!token) {
    window.location.replace('./admin_login.html')
    // eslint-disable-next-line no-alert
    alert('Kindly login or create Account')
  }
  else {
    // document.getElementById('responseMessage').innerHTML = courseTitle
    const dataBody = JSON.stringify({
      courseTitle
    })
    const URL = 'https://cbtng.herokuapp.com/api/v1/courses/Approve'
    createCourses(URL, dataBody)
  }
}
const createCourses = (URL, dataBody) => {
  const bearer = `${token}`
  fetch(URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token':bearer,
      "Access-Control-Allow-Origin": "*",
      },
    body:dataBody
    })
    .then((res) => {
      if (res.status === '401') {
        // eslint-disable-next-line no-alert
        alert('Access denied')
        window.location.replace('./adminHome.html')
      }
      else {
        return res.json()
      }
    })
    .then((data) => {
      if (data.success === 'true') {
        document.getElementById('responseMessage').innerHTML = `${data.message}`
      }
      else {
        document.getElementById('responseMessage').innerHTML = `${data.message}`
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}
document.getElementById('addCourses').addEventListener('submit', addCourses)
