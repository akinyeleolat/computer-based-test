let  imageLink;
// handle image upload
cloudinary.applyUploadWidget('#upload_widget_opener',{ 
  cloudName: 'akinyeleolat', uploadPreset: 'preset1', 
  cropping: true, folder: 'cbt' }, (error, result) => {
    if (result && result.event === "success") {
      // do something
       imageLink = result.info.url
      return imageLink
  }
   }); 
   // create user account
const createAccount = (url,dataBody,redirectHome) => {
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
        document.getElementById('responseMessage').innerHTML = data.message+` Kindly await the admin to activate your account`
       }
       else{
         document.getElementById('responseMessage').innerHTML = data.message
       }
    })
    .catch((error) => {
      document.getElementById('responseMessage').innerHTML = error
    });
};

const addUser = (event) => {
  event.preventDefault()
  //  get form input
  const firstName = document.getElementById('FirstName').value.trim()
  const lastName = document.getElementById('LastName').value.trim()
  const email = document.getElementById('email').value.trim()
  const telephone = document.getElementById('telephone').value.trim()
  const password = document.getElementById('password').value.trim()
  const password2 = document.getElementById('password2').value.trim()
  const department = document.getElementById('department').value.trim()
  const faculty = document.getElementById('faculty').value.trim()
  const accountType = document.querySelector('.form-check-input:checked').value
  const imageUrl =  imageLink
  
  // check password matched
  if (password !== password2) {
    document.getElementById('responseMessage').innerHTML = 'Password not matched'
  }
  else {
    //https://cbtng.herokuapp.com/api/v1/auth/admin/signup
    //admin details
    const adminUrl = 'https://cbtng.herokuapp.com/api/v1/auth/admin/signup'
    const adminHome = './adminHome.html'
    
    // candidate details
    const candidateUrl = 'https://cbtng.herokuapp.com/api/v1/auth/signup'
    const candidateHome = './candidateHome.html'
    // Data body
    const dataBody = JSON.stringify({
      firstname: firstName,
      lastname: lastName,
      email,
      telephone,
      password,
      image:imageUrl,
      department,
      faculty
    })
    // create user account
    if (accountType === 'admin' || 'lecturer') {
      createAccount(adminUrl,dataBody,adminHome)
    }
    if (accountType === 'candidate') {
      createAccount(candidateUrl,dataBody,candidateHome)
  }
}
}
document.getElementById('SignUpUser').addEventListener('submit', addUser)
