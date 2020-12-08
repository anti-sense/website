var express = require('express');
var router = express.Router();
var trustifi=require('./../components/emailer/trustifi') 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AntiSense - Next-Generation of smelling' });
});

router.post('/contact/lead', function(req, res, next) {
  let data=req.body
  trustifi(data).then(data=>{
    res.json(data)    
  }).catch(err=>{
    res.json(err)
  })
  
});


module.exports = router;
