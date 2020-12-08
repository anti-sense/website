var https = require('follow-redirects').https;
var fs = require('fs');

const trustifi_key=process.env.trustikey_key || "fca3ae31061f669100e362b95d4e4310c663f19090c0ba48"
const trustifi_secret=process.env.trustikey_secret || "c5ad14d0f95375d7d1a7309734a9211b"

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

  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

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
        "email":"brunovasquescosta@gmail.com",
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
    "html":data.msg,
    "methods":{"postmark":false,"secureSend":false,"encryptContent":false,"secureReply":false}
  });

  req.write(postData);

  req.end();

}