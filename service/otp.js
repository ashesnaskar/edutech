const axios = require('axios');
exports.sendMessage =(phoneNo,otp)=>{
    return new Promise((resolve, reject)=>{
        const qs = require('querystring');
        const string = `Your OTP for Phone Number verification is ${otp} -OPUSED`
        axios({
            method: 'GET',
            url: `https://malert.in/api/api_http.php?username=OPUS&password=Admin@2020&senderid=OPUSED&to=${phoneNo}&text=${string}&route=Informative&type=text`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
          })
          .then(resp=>{
            resolve(resp)
        })
          .catch(err=>{
            reject(err);
        })
    })
};
