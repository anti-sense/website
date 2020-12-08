var https = require('follow-redirects').https;
var fs = require('fs');
const trustifi_key=process.env.trustifi_key || require('./../../.config_res').trustifi.key
const trustifi_secret=process.env.trustifi_secret || require('./../../.config_res').trustifi.secret

module.exports=function(data){
  var options = {
    'method': 'POST',
    'hostname': 'be.trustifi.com',
    'path': '/api/i/v1/email',
    'headers': {
      'x-trustifi-key': trustifi_key,
      'x-trustifi-secret': trustifi_secret,
      'Content-Type': 'application/json'
    },
    'maxRedirects': 20
  };

  var postData = JSON.stringify({
    /*"from":{
      email:"info@anti-sense.com",
      name:"Post sender"
    },*/
    "recipients":[
      {
        "email":data.email,
        "name":data.name,
        "phone":{
          "country_code":data.country_code,
          "phone_number":data.phone_number
        }
      }
    ],
    "bcc":[
      {
        "email":"becosta@fc.ul.pt",
        "name":"Bruno Costa",
        "phone":{
          "country_code":"+351",
          "phone_number":"912547011"
        }
      }
    ],
    "lists":[],
    "contacts":[],
    "attachments":[],
    "title":data.subject,
    "html":`Contact request from website, from ${data.name}.\n${data.message}`,
    "methods":{"postmark":false,"secureSend":false,"encryptContent":false,"secureReply":false}
  });

  return new Promise((resolve,reject)=>{
    let verification=verify(data)
    if(verification.pass==true){
      var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function (chunk) {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
          resolve(body.toString())
        });

        res.on("error", function (error) {
          console.error(error);
          reject(error)
        });
      });

      req.write(postData);

      req.end();
    }else{
      reject({error:400,message:verification.motive})
    }
  })
}


function verify(data){
  if(data.message==""){
    return {pass:false,motive:"No message was received!"}
  }else if(data.email==""){
    return {pass:false,motive:"No email was received!"}
  }else if(data.name==""){
    return {pass:false,motive:"No name was received!"}        
  }else{
    return {pass:true}
  }
}
