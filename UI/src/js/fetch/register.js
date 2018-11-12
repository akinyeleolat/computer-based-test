const checkValue = (string) => {
  if (string.length === 0) {
    document.getElementById('responseMessage').innerHTML = 'Fields  cannot be empty '
  }
}
const addUser = (event) => {
  event.preventDefault()
  //  get form input
  const firstName = document.getElementById('FirstName').value.trim()
  const lastName = document.getElementById('LastName').value.trim()
  const email = document.getElementById('email').value.trim()
  const telephone = document.getElementById('telephone').value.trim()
  const password = document.getElementById('password').value.trim()
  const password2 = document.getElementById('password2').value.trim()
  const accountType = document.querySelector('.form-check-input:checked').value
  //   // check null input
  //   if (event) {
  //     checkValue(firstName)
  //     checkValue(lastName)
  //     checkValue(email)
  //     checkValue(telephone)
  //     checkValue(password)
  //     checkValue(password2)
  //   }

  // check password matched
  if (password !== password2) {
    document.getElementById('responseMessage').innerHTML = 'Password not matched'
  }
  else {
    //
    const adminUrl = 'https://cbtng.herokuapp.com/auth/admin/signup'
    const candidateUrl = 'https://cbtng.herokuapp.com/auth/signup'
    const adminHome = './adminHome.html'
    const candidateHome = './candidateHome.html'
    const dataBody = JSON.stringify({
      firstname: firstName,
      lastname: lastName,
      email,
      telephone,
      password
    })
    console.log(dataBody)
    if (accountType === 'admin' || 'lecturer') {
      const url = adminUrl
      fetch(url, {
        method:'POST',
        headers:{
          Accept:'application/json,text/plain,*/*',
          'Content-type':'application/json'
        },
        body:JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email,
          telephone,
          password
        })
      })
        .then((res) => res.json())
        .then((data) =>
        document.getElementById('responseMessage').innerHTML = data
        )
    }
    if (accountType === 'candidate') {
      console.log(candidateUrl, candidateHome)
    }
  }
}
document.getElementById('SignUpUser').addEventListener('submit', addUser)


