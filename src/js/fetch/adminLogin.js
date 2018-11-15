
 const LoginAdmin = (url,dataBody,redirectHome) => {
    console.log('Url:',url)
    console.log('Details:',dataBody)
    console.log('Redirect:',redirectHome)
    fetch(url, {
      method:'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      },
      body:dataBody
    })
      .then((res) => res.json())
      .then((data) =>{
        if(data.success==='true'){
          window.location.replace(`${redirectHome}`)
          console.log(data)
          // document.getElementById('responseMessage').innerHTML = data.message+` Kindly await the admin to activate your account`
         }
         else{
           document.getElementById('responseMessage').innerHTML = data.message
           console.log(data)
         }
      })
      .catch((error) => {
        console.error('Error:', error)
        document.getElementById('responseMessage').innerHTML = error
      });
  };
  
  const adminLogin = (event) => {
    event.preventDefault()
    //  get form input
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()
    // check password matched
    if (!email || !password) {
      document.getElementById('responseMessage').innerHTML = 'values required'
    }
    else {
      // admin details
      const adminUrl = 'https://cbtng.herokuapp.com/api/v1/auth/admin/login'
      const adminHome = './adminHome.html'
      // Data body
      const dataBody = JSON.stringify({
        email,
        password
      })
      // create user account
      if (dataBody) {
        LoginAdmin(adminUrl,dataBody,adminHome)
      }
  }
  }
  document.getElementById('adminLogin').addEventListener('submit', adminLogin)
  