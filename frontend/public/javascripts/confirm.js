// DOM Elements
const pageURL = document.location.href

// Helper Methods

function getParameterByName(name, url) {
    if (!url) { url = window.location.href }
    name = name.replace(/[\[\]]/g, '\\$&')
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    const results = regex.exec(url)
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
// query string:
// var myURL = 'localhost:3000/confirmation?foo=lorem&bar=&baz'
// var foo = getParameterByName('foo', myURL) ---> 'lorem'


function validateLocation(queryLocation, geolocation) {
  return new Promise((resolve, reject) => {
    const isValid = isInRange(queryLocation, geolocation)
    resolve(isValid)
  })
}

function isInRange(queryLocation, geolocation) {
  const longDiff = Math.abs(queryLocation.longitude - geolocation.longitude)
  const latDiff = Math.abs(queryLocation.latitude - geolocation.latitude)

  return false //longDiff > 50 || latDiff > 50
}

function renderStatus(verified = false, message = "") {
  const imageSection = document.querySelector('#check-or-x')
  const statusMessage = document.querySelector('#status-message')
  const spinner = imageSection.querySelector('.spinner')

  spinner.remove()
  statusMessage.textContent = ""

  if (verified) {
    const check = document.createElement('div')
    check.classList.add('checkmark')
    statusMessage.textContent = "Confirmed"
    imageSection.appendChild(check)

  } else {
    const xMark = document.createElement('div')
    xMark.innerHTML = "x"
    xMark.classList.add('x-mark')
    statusMessage.textContent = message
    imageSection.appendChild(xMark)

  }
}


// Listeners & Events

window.addEventListener('DOMContentLoaded', ev => {
  // const queryLocation = getParameterByName('location', pageURL)
  const queryLocation = { latitude: 100, longitude: 200} // <-- dummy object

  if ('geolocation' in navigator) {
    // Check geolocation
    navigator.geolocation.getCurrentPosition(async function (position) { // ignore linter warning on function
      const { latitude, longitude } = await position.coords
      console.table(position)

      validateLocation({ queryLat: queryLocation.latitude, queryLong: queryLocation.longitude }, { latitude, longitude })
      .then(locationValid => {
        const message = locationValid ? "Location Confirmed" : "Transaction denied, location incorrect"
        renderStatus(locationValid, message)
      }).catch(err => console.error(err))
    })


  } else {
    renderStatus(false, "Could not find location")
  }
})
