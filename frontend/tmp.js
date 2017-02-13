var twilio = require('twilio')
 // Twilio Credentials
var accountSid = 'AC23bee3a9f6af48eeda733ecfb34350d4';
var authToken = 'd19a432667c8bf2df19224b3e3e875ba';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

  const galvLat = 37.787601;
  const galvLon = -122.396643;
//
// // 10.3.32.64
// app.get('/sendText', (req, res) => {
//     const { phoneNumber } = req.query;
//     console.log(phoneNumber);
//     const merchId = 'RCTST0000008099';
    // const body = `please authorize your transaction by visiting ${process.env.AUTH_URL || 'https://localhost:3000'}/?phoneNumber=${phoneNumber}&merchantId=${merchId}&lat=${galvLat}&lon=${galvLon}`;
//     client.messages.create({
//         from: "+18562194031",
//         to: phoneNumber,
//         body
//     }, function(err, message) {
//         console.log(err)
//         console.log(message);
//     });
// });


var admin = require("firebase-admin");

var fs = require('fs');
var serviceAccount = fs.readFileSync("./bin/serviceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(require('./bin/serviceKey.json')),//serviceAccount),
  databaseURL: "https://asdfasda-4bc1f.firebaseio.com"
});


var db = admin.database();
const users = db.ref('/users');


users.child('4158329522').on('value', (s) => {
    console.log('WORKING')
    const val = s.val();
    const phoneNumber = 4158329522
    if(val.authenticationState === 'PENDING') {
        const merchId = 'RCTST0000008099';
        const body = `please authorize your transaction by visiting ${process.env.AUTH_URL || 'https://10.3.32.64:3000'}/?phoneNumber=${phoneNumber}&merchantId=${merchId}&lat=${galvLat}&lon=${galvLon}`;
        client.messages.create({
            from: "+18562194031",
            to: phoneNumber,
            body
        }, function(err, message) {
            console.log(err)
            console.log(message);
        });
    }
})
module.exports = function validate(req) {
  console.log("VALIDATING")
  const { auth } = req.query;
  console.log("validate is called")
  users.child(4158329522).once('value', (s) => {
      const {authenticationState} = s.val();
      users.child(4158329522).set({authenticationState : auth ? 'AUTHENTICATED' : 'FAILED'});
  });
}
