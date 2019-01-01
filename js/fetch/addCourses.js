const token = localStorage.getItem('token')

const addCourses = (event) => {
  event.preventDefault()
  //  get form input
  const courseTitle = document.getElementById('courseTitle').value.trim()
  const courseDescription = document.getElementById('course_description').value.trim()
  if (!token) {
    window.location.replace('./admin_login.html')
    // eslint-disable-next-line no-alert
    alert('Kindly login or create Account')
  } else {
    // document.getElementById('responseMessage').innerHTML = courseTitle
    const dataBody = JSON.stringify({
      courseTitle,
      courseDescription
    })
    const URL = 'https://cbtng.herokuapp.com/api/v1/courses'
    createCourses(URL, dataBody)
  }
}
const createCourses = (URL, dataBody) => {
  const bearer = `${token}`
  fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token:bearer,
      'Access-Control-Allow-Origin': '*'
    },
    body:dataBody
  })
    .then((res) => {
      if (res.status === '401') {
        // eslint-disable-next-line no-alert
        alert('Access denied')
        window.location.replace('./adminHome.html')
      } else {
        return res.json()
      }
    })
    .then((data) => {
      if (data.success === 'true') {
        document.getElementById('responseMessage').innerHTML = `${data.message}`
      } else {
        document.getElementById('responseMessage').innerHTML = `${data.message}`
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}

const fetchCourses = () => {
  const URL = 'https://cbtng.herokuapp.com/api/v1/courses/approve'
  const bearer = `${token}`
  fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token:bearer,
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then((res) => {
      if (res.status === '401') {
        // eslint-disable-next-line no-alert
        alert('Access denied')
        window.location.replace('./adminHome.html')
      } else {
        return res.json()
      }
    })
    .then((data) => {
      if (data.success === 'true') {
        let courseItem = ''
        data.courses.forEach((viewCourses) => {
          courseItem += `
          <div class="col-6 col-lg-3">
                        <div class="card">
                          <div class="card-body p-3 d-flex align-items-center">
                            <i class="fa fa-laptop bg-info p-3 font-2xl mr-3"></i>
                            <div>
                              <div class="text-value-sm text-info">${viewCourses.course_title.toUpperCase()}</div>
                              <span class="small font-weight-bold">New</span>
                            </div>
                          </div>
                          <div class="card-footer px-3 py-2">
                          <div class="text-muted text-uppercase font-weight-bold small">${viewCourses.course_description.toUpperCase()}</div>
                          </div>
                          <div class="card-footer px-3 py-2">
                          <div class="text-uppercase small" id="courseId${viewCourses.id}" style="display:none;color:#f86c6b">${viewCourses.id}</div>
                            <a class="btn-block text-muted d-flex justify-content-between align-items-center">
                              <button class="btn btn-block btn-primary" type="button" id="${viewCourses.id}">Approve</button>
                            </a>
                          </div>
                        </div>
                      </div>
          `
        })
        document.getElementById('courseView').innerHTML = courseItem
        if (data.message === 'Expired user authorization token') {
          window.location.replace('./admin_login.html')
        } 
      }     
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}
const approveCourses = (URL, dataBody, courseID) => {
  const bearer = `${token}`
  fetch(URL, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token':bearer,
      'Access-Control-Allow-Origin': '*'
    },
    body:dataBody
  })
    .then((res) => {
      if (res.status === '401') {
        // eslint-disable-next-line no-alert
        alert('Access denied')
        window.location.replace('./adminHome.html')
      } else {
        return res.json()
      }
    })
    .then((data) => {
      if (data.success === 'true') {
        document.getElementById(`courseId${courseID}`).innerHTML = `${data.message}`
        document.getElementById(`courseId${courseID}`).style.display = 'inline'
      } else {
        document.getElementById(`courseId${courseID}`).innerHTML = `${data.message}`
        document.getElementById(`courseId${courseID}`).style.display = 'inline'
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}
const getApproved = (e) => {
  if (e.target !== e.currentTarget) {
    const courseID = e.target.id
    const approveURL = `https://cbtng.herokuapp.com/api/v1/courses/${courseID}`
    const approveBody = JSON.stringify({
      courseAvailability : 'true'
    })
    approveCourses(approveURL, approveBody, courseID)
  }
  e.stopPropagation()
}

const theParent = document.querySelector('#courseView')
theParent.addEventListener('click', getApproved, false)

document.getElementById('addCourses').addEventListener('submit', addCourses)
window.onload = function () {
  if (!token) {
    window.location.replace('./admin_login.html')
    // eslint-disable-next-line no-alert
    alert('Kindly login or create Account')
  } else {
    fetchCourses()
  }
}


