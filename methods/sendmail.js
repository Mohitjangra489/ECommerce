 
 const mailjet = require('node-mailjet').apiConnect(
    "7e74af2efa5950a7a22cd6e2da0c7d87",
    "8ee2341bc3cfba42478048033d2aa3da"
  );

  module.exports=function(email, otp ,callback)
  {

      const request = mailjet.post('send', { version: 'v3.1' }).request({
          Messages: [
              {
                  From: {
          Email: 'mohitjangra489@gmail.com',
          Name: 'mohitjangra489@gmail.com',
        },
        To: [
            {
                Email: email,
            Name: 'open email',
          },
        ],
        subject: "Otp for registration is: ",
        HTMLPart:
        "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>",
    },
],
})
request
.then(result => {
    console.log(result.body);
    callback(null,result.body);
})
.catch(err => {
    console.log(err);
    callback(err,null);
})
}