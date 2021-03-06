// Helper Methods

function getParameterByName(name, url) {
  if (!url) { url = window.location.href }
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
// query string:
// var myURL = 'localhost:3000/?foo=lorem&bar=&baz'
// var foo = getParameterByName('foo', myURL) ---> 'lorem'


function validateLocation(queryLocation, geolocation) {
  return new Promise((resolve, reject) => {
    const isValid = isInRange(queryLocation.latitude, queryLocation.longitude, geolocation.latitude, geolocation.longitude, "K")
    resolve(isValid)
  })
}

function isInRange(lat1, lon1, lat2, lon2, unit) {
  const radlat1 = Math.PI * lat1/180
  const radlat2 = Math.PI * lat2/180
  const theta = lon1-lon2
  const radtheta = Math.PI * theta/180
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist <= 0.05 // 0.05 kilometers === 50 meters
}

function renderStatus(verified = false, message = '') {
  const imageSection = document.querySelector('#check-or-x')
  const statusMessage = document.querySelector('#status-message')
  const spinner = imageSection.querySelector('.spinner')
  const checkmark = document.querySelector('.checkmark')

  if (spinner) spinner.remove()
  statusMessage.textContent = message

  if (verified) {
    // Render check mark & countdown
    const check = document.createElement('div')
    check.classList.add('checkmark')
    imageSection.appendChild(check)

    // start countdown
    const time = new Date()
    const app = new Countdown({
      //properties
      endDate: time.setSeconds(time.getSeconds() + 90)
    });


  } else if (!verified && !checkmark) {
    const xMark = document.createElement('div')
    xMark.innerHTML = 'x'
    xMark.classList.add('x-mark')
    imageSection.appendChild(xMark)

  } else {
    const check = document.querySelector('.checkmark')
    check.remove()

    const xMark = document.createElement('div')
    xMark.innerHTML = 'x'
    xMark.classList.add('x-mark')
    imageSection.appendChild(xMark)

  }
}

// Event Listeners

$(function() {
  const pageURL = window.location.search
  const queryLat = Number(getParameterByName('lat', pageURL))
  const queryLong = Number(getParameterByName('lon', pageURL))
  const queryLocation = { latitude: queryLat, longitude: queryLong }

    console.log(queryLocation, "Query Location")

  // Check for geolocation enabeled
  if ('geolocation' in navigator) {
    console.log('1')
    navigator.geolocation.getCurrentPosition(async function (position) { // ignore linter warning on function
      const { latitude, longitude } = await position.coords
console.log('2')
      validateLocation(queryLocation, { latitude, longitude })
      .then(locationValid => {
        console.log('3')
        const message = locationValid ? 'Location Confirmed' : 'Transaction denied, location incorrect'

        $.ajax({
          method: "GET",
          url: `https://10.3.32.64:3000/validate?auth=${locationValid}`,
          crossOrigin: true,
          dataType: "jsonp",
          success: (success) => console.log(success),
          error: (err) => console.error(err)
        })

        renderStatus(locationValid, message)
      }).catch(err => console.error(err))
    })


  } else if (google.loader.ClientLocation) {
    const { latitude, longitude } = google.loader.ClientLocation
console.log('4')
    validateLocation(queryLocation, { latitude, longitude })
    .then(locationValid => {
      const message = locationValid ? 'Location Confirmed' : 'Transaction denied, location incorrect'
      renderStatus(locationValid, message)
    }).catch(err => console.error(err))


  } else {
    console.log('5')
    // Render an X with message if location denied or not found
    renderStatus(false, 'Could not find location')
  }


  const Countdown = function(options) {
    $.extend(this, {
      endDate: new Date(2017, 4, 26, 15, 02, 20, 0)
    }, options);

    this.cache();
    this.bind();

    return this;
  };
  $.extend(Countdown.prototype, {
    cache: function() {
      this.date = new Date();
      this.secCounter = parseInt((this.endDate - this.date) / 1000);
    },
    bind: function() {
      this.timer();
    },
    timer: function() {
      let timeInSec = this.secCounter,
        $secondsCircle = $('.seconds').closest('.time-circle').find('.progress'),
        $minutesCircle = $('.minutes').closest('.time-circle').find('.progress'),
        $hoursCircle = $('.hours').closest('.time-circle').find('.progress'),
        $seconds = $('.seconds'),
        $minutes = $('.minutes'),
        $hours = $('.hours');

      function pad(number) {
        return (number < 10 ? '0' : '') + number
      }

      function setScale(type, degree) {
        type.css({
          '-webkit-transform': 'rotate(' + -degree * 6 + 'deg)',
          '-moz-transform': 'rotate(' + -degree * 6 + 'deg)',
          '-ms-transform': 'rotate(' + -degree * 6 + 'deg)',
          '-o-transform': 'rotate(' + -degree * 6 + 'deg)',
          'transform': 'rotate(' + -degree * 6 + 'deg)'
        });
      };

      let setInterv = setInterval(function() {

        (timeInSec > 0 ? timeInSec-- : timeInSec = 0);

        let getSeconds = timeInSec % 60,
          getMinutes = Math.floor(timeInSec / 60 % 60),
          getHours = Math.floor(timeInSec / 3600 % 24),
          getDays = Math.floor(timeInSec / 86400 % 7),
          getWeeks = Math.floor(timeInSec / 604800);

        $seconds.text(pad(getSeconds));
        $minutes.text(pad(getMinutes));
        $hours.text(pad(getHours));

        setScale($secondsCircle, getSeconds);
        setScale($minutesCircle, getMinutes);
        setScale($hoursCircle, getHours);

        if (timeInSec <= 0) {
          clearInterval(setInterv);
          console.log('End of counting');
          renderStatus(false, "Please revarify card")
        }

      }, 1000);
    }
  });
  window.Countdown = Countdown;
});
