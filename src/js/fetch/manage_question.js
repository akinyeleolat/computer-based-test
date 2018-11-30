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
const getQuestions = (e) => {
  e.preventDefault()
  // Get courseID
  const getCourse = document.getElementById('courseList')
  const getCourseID = getCourse.value
  if (!token) {
    verifyToken()
  } else {
    const questionURL = `https://cbtng.herokuapp.com/api/v1/courses/${ getCourseID }/questions`
    fetchQuestions(questionURL)
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
const fetchQuestions = (URL) => {
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
      } else {
        return res.json()
      }
    })
    .then((data) => {
      if (data.success === 'true') {
        let outputQuestions = `
        <table class="table table-responsive-sm table-hover table-outline mb-0">
        <thead class="thead-light">
          <tr>
            <th class="text-center">
              <i class="icon-people"></i>
            </th>
            <th>Question</th>
            <th class="text-center">Option 1</th>
            <th class="text-center">Option 2</th>
            <th class="text-center">Option 3</th>
            <th class="text-center">Option 4</th>
            <th class="text-center">Correct Answer</th>
          </tr>
        </thead>
        <tbody>`
        data.questions.forEach((viewQuestions) => {
          outputQuestions += `<tr>
          <td class="text-center">
            1
          </td>
          <td>
            <div>${viewQuestions.questions}</div>
            <div class="small text-muted">
              <span>New</span> | Added: ${viewQuestions.created_at}</div>
          </td>
          <td class="text-center">
          ${viewQuestions.option_one}
          </td>
          <td class="text-center">
          ${viewQuestions.option_two}
          </td>
          <td class="text-center">
          ${viewQuestions.option_three}
          </td>
          <td class="text-center">
          ${viewQuestions.option_four}
              </td>
          <td class="text-center">
          ${viewQuestions.correct_answer}
          </td>
        </tr>
      `
        })
        outputQuestions += ` </tbody>
                </table>`
        document.getElementById('questionView').innerHTML = outputQuestions
      } else {
        document.getElementById('questionView').innerHTML = data.message
        // window.location.replace('./adminHome.html')
        // // eslint-disable-next-line no-alert
        // alert('Access denied')
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
document.getElementById('getQuestions').addEventListener('submit', getQuestions)
window.onload = function () {
  if (!token) {
    verifyToken()
  } else {
    fetchCourses()
  }
}

