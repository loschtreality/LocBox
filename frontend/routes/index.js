var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LocBox' })
})

/* GET transactions page */
router.get('/transactions', function(req, res, next) {
  res.render('transactions', { title: 'LocBox Transactions', secure: true })
})

module.exports = router
