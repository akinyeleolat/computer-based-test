const token = localStorage.getItem('token')
window.onload = function () {
  if (!token) {
    window.location.replace('./admin_login.html')
    alert('Kindly login or create Account')
  }
  else {
    fetchAdmin()
  }
}

const fetchAdmin = () => {
  const URL = 'https://cbtng.herokuapp.com/api/v1/admins'
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
        // const output = JSON.stringify(data.lecturers)
        // // eslint-disable-next-line no-console
        // console.log(output)
        let output = `<br>
        <table class="table table-responsive-sm table-hover table-outline mb-0">
                <thead class="thead-light">
                  <tr>
                    <th class="text-center">
                      <i class="icon-people"></i>
                    </th>
                    <th>Lecturers/Admin Name</th>
                    <th class="text-center">Email</th>
                    <th class="text-center">Telephone</th>
                    <th>Department</th>
                    <th class="text-center">Faculty</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>`
        data.lecturers.forEach((viewAdmin) => {
          output += `<tr>
                    <td class="text-center">
                      <div class="avatar">
                        <img class="img-avatar" src="${viewAdmin.image_url}" >
                        <span class="avatar-status badge-success"></span>
                      </div>
                    </td>
                    <td>
                      <div>${viewAdmin.lastname.toUpperCase()} ${viewAdmin.firstname.toUpperCase()}</div>
                      <div class="small text-muted">
                        <span>New</span> | Registered: ${viewAdmin.created_at}</div>
                    </td>
                    <td class="text-center">
                    ${viewAdmin.email}
                    </td>
                    <td>
                    ${viewAdmin.telephone}
                    </td>
                    <td class="text-center">
                    ${viewAdmin.department.toUpperCase()}
                    </td>
                    <td class="text-center">
                    ${viewAdmin.faculty.toUpperCase()}
                        </td>
                    <td>
                      <button class="btn btn-block btn-primary" type="button" id="${viewAdmin.id}">Approve</button>
                      <div class="small text-muted" id="adminId${viewAdmin.id}" style="display:none;font-color:#f86c6b">${viewAdmin.id}</div>
                    </td>
                  </tr>`
        })
        output += ` </tbody>
                </table>`
        document.getElementById('adminView').innerHTML = output
      }
      else {
        window.location.replace('./adminHome.html')
        // eslint-disable-next-line no-alert
        alert('Access denied')
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}
const approveAdmin = (URL, dataBody, adminID) => {
  document.getElementById(`adminId${adminID}`).innerHTML = 'approving admin'
  const bearer = `${token}`
  fetch(URL, {
    method: 'PATCH',
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
        document.getElementById(`adminId${adminID}`).innerHTML = `${data.message}`
        document.getElementById(`adminId${adminID}`).style.display = 'inline'
      } else {
        document.getElementById(`adminId${adminID}`).innerHTML = `${data.message}`
        document.getElementById(`adminId${adminID}`).style.display = 'inline'
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}
const getApproved = (e) => {
  if (e.target !== e.currentTarget) {
    const adminID = e.target.id
    // // eslint-disable-next-line no-alert
    // alert(`Hello ${clickedItem}`)
    // const id = clickedItem
    const approveURL = `https://cbtng.herokuapp.com/api/v1/admins/${adminID}`
    const approveBody = JSON.stringify({
      approve : true
    })
    approveAdmin(approveURL, approveBody, adminID)
  }
  e.stopPropagation()
}
const theParent = document.querySelector('#adminView')
theParent.addEventListener('click', getApproved, false)
