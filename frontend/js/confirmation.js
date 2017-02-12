// DOM Elements
const imageSection = document.querySelector('#check-or-x')


const pageURL = document.location.href

// Helper Methods

function getParameterByName(name, url) {
    if (!url) { url = window.location.href }
    name = name.replace(/[\[\]]/g, "\\$&")
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
    const results = regex.exec(url)
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "))
}
// query string:
// var myURL = "localhost:3000/confirmation?foo=lorem&bar=&baz"
// var foo = getParameterByName('foo', myURL) ---> "lorem"


function validateLocation(queryLocation, geolocation) {
  return new Promise((resolve, reject) => {
    const isValid = isInRange(queryLocation, geolocation)
    resolve(isValid)
  })
}

function isInRange(/* coordinates A *//* coordinates B */) {
  return true
}

function renderStatus(status) {
  // Remove spinner element
  if (status === "check") {
    // Add check element
  } else {
    // Add X element
  }
}


// Listeners & Events

window.addEventListener('DOMContentLoaded', ev => {
  const queryLocation = getParameterByName("location", pageURL)
  if ("geolocation" in navigator) {
    // Check geolocation
    navigator.geolocation.getCurrentPosition(async function (position) {
      const { latitude, longitude } = await position.coords
      validateLocation("Query Lat and long in an {}", { latitude, longitude }).then(locationValid => {
        if (locationValid) {
          // Render a check to the screen
          renderStatus("check")
        } else {
          // Render an X with an appropriate message
          renderStatus("x")
        }
      }).catch(err => console.error(err))
    })
  } else {
    renderStatus("x")
  }
})
