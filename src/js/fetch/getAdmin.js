const token = localStorage.getItem('token')
window.onload = function () {
  if (!token) {
    window.location.replace('./admin_login.html')
    alert('Kindly login or create Account')
  }
  else {
    fetchAdmin()
    fetchCandidate()
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
                      <div>${viewAdmin.lastname} ${viewAdmin.firstname}</div>
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
                    ${viewAdmin.department}
                    </td>
                    <td class="text-center">
                    ${viewAdmin.faculty}
                        </td>
                    <td>
                      <button class="btn btn-block btn-primary" type="button">Approve</button>
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

const fetchCandidate = () => {
    const URL = 'https://cbtng.herokuapp.com/api/v1/users'
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
        let outputCandidate = `<br>
          <table class="table table-responsive-sm table-hover table-outline mb-0">
                  <thead class="thead-light">
                    <tr>
                      <th class="text-center">
                        <i class="icon-people"></i>
                      </th>
                      <th>Candidates</th>
                      <th class="text-center">Email</th>
                      <th class="text-center">Telephone</th>
                      <th>Department</th>
                      <th class="text-center">Faculty</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>`
        data.candidates.forEach((viewCandidates) => {
          outputCandidate += `<tr>
                      <td class="text-center">
                        <div class="avatar">
                          <img class="img-avatar" src="${viewCandidates.image_url}" >
                          <span class="avatar-status badge-success"></span>
                        </div>
                      </td>
                      <td>
                        <div>${viewCandidates.lastname} ${viewCandidates.firstname}</div>
                        <div class="small text-muted">
                          <span>New</span> | Registered: ${viewCandidates.created_at}</div>
                      </td>
                      <td class="text-center">
                      ${viewCandidates.email}
                      </td>
                      <td>
                      ${viewCandidates.telephone}
                      </td>
                      <td class="text-center">
                      ${viewCandidates.department}
                      </td>
                      <td class="text-center">
                      ${viewCandidates.faculty}
                          </td>
                      <td>
                        <button class="btn btn-block btn-primary" type="button">Approve</button>
                      </td>
                    </tr>`
        })
        outputCandidate += ` </tbody>
                  </table>`
        document.getElementById('candidateView').innerHTML = outputCandidate
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
