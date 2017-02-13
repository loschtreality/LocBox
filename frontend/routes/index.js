var express = require('express')
var router = express.Router()
var validate = require('/Users/MLL/Documents/GitHub/LocBox/frontend/tmp');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LocBox' })
})

const galvLat = 37.787601;
const galvLon = -122.396643;


/* GET transactions page */
router.get('/transactions', function(req, res, next) {
  res.render('transactions', { title: 'LocBox Transactions', secure: true })
})
router.get('/validate', function(req, res, next) {
  validate(req);
  res.sendText('hello')
})

module.exports = router
