const token = localStorage.getItem('token')
const verifyToken = () => {
  window.location.replace('./admin_login.html')
  // eslint-disable-next-line no-alert
  alert('Kindly login or create Account')
}
const addQuestions = (event) => {
  event.preventDefault()
  // Get courseID
  const selCourse = document.getElementById('courseView')
  const courseID = selCourse.value
  //  get form question input
  const question = document.getElementById('question').value.trim()
  const OptionOne = document.getElementById('OptionOne').value
  const OptionTwo = document.getElementById('OptionTwo').value
  const OptionThree = document.getElementById('OptionThree').value
  const OptionFour = document.getElementById('OptionFour').value
  const correctAnswer = document.getElementById('correctAnswer').value.trim()
  if (!token) {
    verifyToken()
  } else {
    const dataBody = JSON.stringify({
      question,
      OptionOne,
      OptionTwo,
      OptionThree,
      OptionFour,
      correctAnswer
    })
    const URL = `https://cbtng.herokuapp.com/api/v1/courses/${ courseID }/questions`
    createQuestions(URL, dataBody)
  }
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
        const courseList = document.getElementById('courseList')
        const courseView = document.getElementById('courseView')
        data.courses.forEach((viewCourses) => {
          const option = document.createElement('option')
          option.text = `${viewCourses.course_title.toUpperCase()} ${viewCourses.course_description.toUpperCase()}`
          option.value = `${viewCourses.id}`
          courseList.add(option)
        //   courseView.add(option)
        })
        data.courses.forEach((viewCourses) => {
          const option = document.createElement('option')
          option.text = `${viewCourses.course_title.toUpperCase()} ${viewCourses.course_description.toUpperCase()}`
          option.value = `${viewCourses.id}`
          // courseList.add(option)
          courseView.add(option)
        })
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
const createQuestions = (URL, dataBody) => {
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
document.getElementById('addQuestions').addEventListener('submit', addQuestions)
window.onload = function () {
  if (!token) {
    verifyToken()
  } else {
    fetchCourses()
  }
}

