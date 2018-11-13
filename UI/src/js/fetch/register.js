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
  const imageUrl =  document.getElementById('imageUrl').innerHTML
  console.log(imageUrl)
  
  // check password matched
  if (password !== password2) {
    document.getElementById('responseMessage').innerHTML = 'Password not matched'
  }
  else {
    //https://cbtng.herokuapp.com/api/v1/auth/admin/signup
    const adminUrl = 'https://cbtng.herokuapp.com/api/v1/auth/admin/signup'
    const candidateUrl = 'https://cbtng.herokuapp.com/api/v1/auth/signup'
    const adminHome = './adminHome.html'
    const candidateHome = './candidateHome.html'
    const dataBody = JSON.stringify({
      firstname: firstName,
      lastname: lastName,
      email,
      telephone,
      password,
      image:imageUrl
    })
    console.log(dataBody)
    if (accountType === 'admin' || 'lecturer') {
      const url = adminUrl
      console.log(url)
      fetch(url, {
        method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
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
        .then((data) =>{
          document.getElementById('responseMessage').innerHTML = data
          console.log(data)
        })
    }
    if (accountType === 'candidate') {
      console.log(candidateUrl, candidateHome)
    }
  }
}
document.getElementById('SignUpUser').addEventListener('submit', addUser)
