const token = localStorage.getItem('token')
let courseID = 0
const verifyToken = () => {
  window.location.replace('./admin_login.html')
  // eslint-disable-next-line no-alert
  alert('Kindly login or create Account')
}
const fetchCourses = () => {
  const URL = 'https://cbtng.herokuapp.com/api/v1/courses'
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
        data.courses.forEach((viewCourses) => {
          const option = document.createElement('option')
          option.text = `${viewCourses.course_title.toUpperCase()} ${viewCourses.course_description.toUpperCase()}`
          option.value = `${viewCourses.id}`
          courseList.add(option)
          //   courseView.add(option)
        })
        if (data.message === 'Expired user authorization token') {
          window.location.replace('./candidateHome.html')
        }
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}
const getQuestions = (e) => {
  e.preventDefault()
  // Get courseID
  const getCourse = document.getElementById('courseList')
  const getCourseID = getCourse.value
  courseID = getCourseID
  if (!token) {
    verifyToken()
  } else {
    const questionURL = `https://cbtng.herokuapp.com/api/v1/courses/${getCourseID}/questions`
    fetchQuestions(questionURL)
  }
}

const submitTest = (event) => {
  event.preventDefault()
  const questionValue = document.querySelectorAll('.questionList')
  const answers = []
  for (let i = 0; i < questionValue.length; i++) {
    const questionId = questionValue[i].getAttribute('id')
    const choice = document.getElementById(questionId).value || document.querySelector(`.form-check-input${questionId}:checked`).value
    const responseObj = {
      questionId: Number(questionId),
      choice
    }
    answers.push(responseObj)
  }
  const answerData = {
    answers,
  }
  const answerBody = JSON.stringify(answerData)
  
  if (!token) {
    verifyToken()
  } else {
    const testURL = `https://cbtng.herokuapp.com/api/v1/courses/${courseID}/test`
    fetchTest(testURL, answerBody)
  }
}
// send answers for checking
const fetchTest = (URL, dataBody) => {
  const bearer = `${token}`
  fetch(URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
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
        window.location.replace('./candidateHome.html')
      } else {
        return res.json()
      }
    })
    .then((data) => {
      if (data.success === 'true') {
        document.getElementById('resultView').innerHTML = `${data.message}`
        document.getElementById('resultView').style.display = 'inline'
      } else {
        document.getElementById('resultView').innerHTML = `${data.message}`
        document.getElementById('resultView').style.display = 'inline'
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
        window.location.replace('./index.html')
      } else {
        return res.json()
      }
    })
    .then((data) => {
      if (data.success === 'true') {
        let outputQuestions = `
          <table class="table table-responsive-sm table-hover table-outline mb-0">                                      <thead class="thead-light">
            <tr>
                <th class="text-center">
                <i class="icon-people"></i>
                </th>
                <th>Question</th>
                <th class="text-center">Answer</th>
            </tr>
        </thead>
        <tbody>`
        data.questions.forEach((viewQuestions) => {
          const optionOne = viewQuestions.option_one
          const optionTwo = viewQuestions.option_two
          const optionThree = viewQuestions.option_three
          const optionFour = viewQuestions.option_four
          let questionString = ''
          if (!optionOne || !optionTwo || !optionThree || !optionFour) {
            questionString = `<tr>
             <td class="text-center">#</td>
             <td>
            <div>${viewQuestions.questions}</div>
            </td>
            <td>
            <div class="form-group row">
            <div class="col-sm-12">
            <input class="form-control questionList" type="text" id="${viewQuestions.question_id}" placeholder="-Enter your answer-">
            </div>
            </td>
            </tr>`
          } else {
            questionString = `<tr>
            <td class="text-center">#</td>
            <td>
                <div>${viewQuestions.questions} </div>
            </td>
            <td class="questionList" id="${viewQuestions.question_id}">
                <div class="form-group row">
                <div class="col-md-9 col-form-label">
                <div class="form-check form-check-inline mr-1">
                <input class="form-check-input${viewQuestions.question_id}" id="${optionOne}" type="radio" value="${optionOne}" name="${viewQuestions.question_id}">
                <label class="form-check-label" for="${optionOne}">${optionOne}</label>
                </div>

                <div class="form-check form-check-inline mr-1">
                <input class="form-check-input${viewQuestions.question_id}" id="inline-radio2" type="radio" value="option2" name="${viewQuestions.question_id}">
                <label class="form-check-label" for="${optionTwo}">${optionTwo}</label>
                </div>

                <div class="form-check form-check-inline mr-1">
                <input class="form-check-input${viewQuestions.question_id}" id="${optionThree}" type="radio" value="${optionThree}" name="${viewQuestions.question_id}">
                <label class="form-check-label" for="${optionThree}">${optionThree}</label>
                </div>

                <div class="form-check form-check-inline mr-1">
                <input class="form-check-input${viewQuestions.question_id}" id="${optionFour}" type="radio" value="${optionFour}" name="${viewQuestions.question_id}">
                <label class="form-check-label" for="${optionFour}">${optionFour}</label>
                </div>
                </div>
                </div>
                </td>
        </tr>
    `
          }
          outputQuestions += questionString
        })
        outputQuestions += ` 
        <tr>
        <td colspan="2">
        </td>
        <td>
        <div class="row">
            <div class="form-group col-sm-4">
            <input class="btn btn-block btn-primary" type="submit" value="Submit">
            </div> 
            <div class="form-group col-sm-4"> 
            <button class="btn btn-block btn-danger" type="button">Save for Later</button>
            </div>
        </div>
        </td>
    </tr>`
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
document.getElementById('getQuestions').addEventListener('submit', getQuestions)
document.getElementById('candidateTest').addEventListener('submit', submitTest)
window.onload = function () {
  if (!token) {
    verifyToken()
  } else {
    fetchCourses()
  }
}
