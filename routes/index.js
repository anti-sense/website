var express = require('express');
var router = express.Router();
var trustifi=require('./../components/emailer/trustifi') 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/contact/lead', function(req, res, next) {
  let data=req.body
  trustifi(data)
  res.json("ok")
});


module.exports = router;
