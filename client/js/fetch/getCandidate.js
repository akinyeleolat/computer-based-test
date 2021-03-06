const token = localStorage.getItem('token')
window.onload = function () {
  if (!token) {
    window.location.replace('./admin_login.html')
    alert('Kindly login or create Account')
  }
  else {
    fetchCandidate()
  }
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
                        <div>${viewCandidates.lastname.toUpperCase()} ${viewCandidates.firstname.toUpperCase()}</div>
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
                      ${viewCandidates.department.toUpperCase()}
                      </td>
                      <td class="text-center">
                      ${viewCandidates.faculty.toUpperCase()}
                          </td>
                          <td>
                          <button class="btn btn-block btn-primary" type="button" id="${viewCandidates.id}">Approve</button>
                          <div class="small" id="candidateId${viewCandidates.id}" style="display:none;color:#f86c6b">${viewCandidates.id}</div>
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
const approveCandidate = (URL, dataBody, userID) => {
  const bearer = `${token}`
  fetch(URL, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token':bearer,
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
        document.getElementById(`candidateId${userID}`).innerHTML = `${data.message}`
        document.getElementById(`candidateId${userID}`).style.display = 'inline'
      } else {
        document.getElementById(`candidateId${userID}`).innerHTML = `${data.message}`
        document.getElementById(`candidateId${userID}`).style.display = 'inline'
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}
const getApproved = (e) => {
  if (e.target !== e.currentTarget) {
    const userID = e.target.id
    const approveURL = `https://cbtng.herokuapp.com/api/v1/users/${userID}`
    const approveBody = JSON.stringify({
      approve : 'true'
    })
    approveCandidate(approveURL, approveBody, userID)
  }
  e.stopPropagation()
}
const theParent = document.querySelector('#candidateView')
theParent.addEventListener('click', getApproved, false)