const token = localStorage.getItem('token')

const fetchCourses = () => {
  const URL = 'https://cbtng.herokuapp.com/api/v1/courses/approve'
  const bearer = `${token}`
  fetch(URL, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token':bearer,
      "Access-Control-Allow-Origin": "*",
    }
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
                          <div class="text-uppercase text-muted small" id="courseID" style="display:none">${viewCourses.id}</div>
                            <a class="btn-block text-muted d-flex justify-content-between align-items-center" href="./questions.html" target="_blank">
                              <button class="btn btn-block btn-primary addQuestion" type="button" id="addQuestion">Add Question</button>
                            </a>
                          </div>
                        </div>
                      </div>
          `
        })
        document.getElementById('courseView').innerHTML = courseItem
      } else {
        document.getElementById('courseView').innerHTML = data.message
        // window.location.replace('./courses.html')
        // // eslint-disable-next-line no-alert
        // alert('Access denied')
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}

window.onload = function () {
  if (!token) {
    window.location.replace('./admin_login.html')
    // eslint-disable-next-line no-alert
    alert('Kindly login or create Account')
  } else {
    fetchCourses()
  }
}


