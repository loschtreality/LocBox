# LocBox

This project was built during the [DeveloperWeek 2017](http://www.developerweek.com/) 30 hour Hackathon for [Clover](https://www.clover.com/). The idea behind LocBox (Location Box) is to be able to geographically confirm a purchase at a Clover terminal. Furthermore, the owner of the card was able to place certain restrictions on the card, such as limiting purchases to certain Clover vendors during specified times at specified locations. However, these features were not able to be implemented due to time constraints.

## Vendor Technologies:

- Clover Terminal
- Twilio

## Front End:

The Front End of this application was designed to be a simple landing page for a mobile device which would grab the user's location using JavaScript's native `navigator.geolocation` method. If the user's position matched the location in the query string, the Front End would send a `GET` to the back end, which updated the value in the database from *PENDING_TRANSACTION* to *AUTHORIZED_TRANSACTION*.

**Technologies Used:**

- HTML
- CSS
- Vanilla JS
- Jquery

## Back End, Device, Database:

The Back End utilized Node.js and Express to run a lightweight server and update values in the Firebase. The Android Studio application and SDK was used to add additional functionality to Clover's platform natively.

**Technologies Used:**

- Express Server
- Node.js
- Firebase
- Android Studio

## Micro-service:

The Micro-service for was implemented using Flask and was responsible for enabling the owner of the card to place the restrictions described in the description of this application.

**Technologies Used:**

- Python
- Flask (to be committed)
