const express = require('express')
const app = express()
//const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const port = 3000
const fetch = require('node-fetch');

//privateKeys.js is created in temp folder that is .gitignored to prevent key leak in repo.
const privateKeys = require('../temp/privateKeys');
// ../temp/privateKeys.js looks something like:
/*
// privateKeys.js
// ========
module.exports = {   
  MFMCustomerId: "somePrivateIdIssuedByVendorGoesHere"
}
*/
if (privateKeys.MFMCustomerId.length < 1) {
    console.log("Process abort! MFMCustomerId must be set up in ../temp/privateKeys.js")
    process.exit(1);
}
console.log ("MFMCustomerID was found and is " + privateKeys.MFMCustomerId.length + " characters long.");
// We are using our packages here
//app.use( bodyParser.json() );       // to support JSON-encoded bodies

//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
// extended: true})); 
app.use(cors())
app.use('/client', express.static('../client')) //when launched from server directory we need ..
//You can use this to check if your server is working
app.get('/', (req, res)=>{
res.send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">
<title>Welcome to your running node server</title>
<!--just try to make it a bit less ugly by grabbing some css off the web-->
<link rel="stylesheet" href="https://www.prowebdesign.ro/simple-responsive-template/css/basic-style.css" />
<style>
a {
    amrgin: auto;
    border-radius: 10px;
    border-style: solid;
}
div {
    margin: auto;
    width: 90%;
    border-style: solid;
}
details {
    cursor: pointer;
  }
</style>
</head>
<body>

<div>
    <a href="../client/localonly-hellorates.html">localonly-hellorates.html</a>
    <details>
        <summary>about localonly-hellorates.html</summary>
        fetch with client side javascript only and no server side.
        <i>for illustration purposes only!</i>
        will not work with most browsers unless you disable security 
        for development via command line switch (e.g. chrome's --disable-web-security)
    </details>
</div>
<div>
    <a href="/loadRates">loadRates</a>
    <details>
        <summary>about loadRates</summary>
        see the server data response read from the vendor server and posted via server side code
    </details>
</div>
<div>
    <a href="../client/clientserver-hellorates.html">clientserver-hellorates.html</a>
    <details>
        <summary>about clientserver-hellorates.html</summary>
        fetches data first with server side code in node.
        Once the server has fetched, the client can use the
        data without "CORS errors" because
        <i>the data is now coming from inside the server</i> 
    </details>
</div>
</body>
</html>
`)
})

app.get("/loadRates", (req, res) => {
    console.log("enter clicked");
    var mfmId="?id=" + privateKeys.MFMCustomerId;
    var mfmurl="https://ratewidget.memberfirstmortgage.com/ratestable.aspx";
    var mfmTitletext="&titletext=Today%27s+Rates";
    var mfmTitlecolor="&titlecolor=434243";
    var mfmHeaderColor="&headerColor=7AC143";
    urlToFetch = mfmurl + mfmId + mfmTitletext + mfmTitlecolor + mfmHeaderColor
    console.log("urlToFetch: " + urlToFetch); 
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    var getResponse;
    fetch(urlToFetch, requestOptions)
        .then(function(response) {
            console.log("processing request response");
            if (!response.ok) {
                console.log("response is NOT ok!");
                console.log(response);
                
                throw new Error('HTTP error, status = ' + response.status);               
            }
        return response.text();
        })
        .then(function(myText) {
            console.log("response was ok, raw response body shown below...");
            console.log(myText);
            //server now has this data and we could edit it here if we wanted to.
            //for now will just mirror the whole page.
            res.send(myText);
        })
    .catch(function(error) {
      console.log("sending error message " + error.message + " to page");
      res.send('HTTP error: ' + error.message)
    });
})

//Start your server on a specified port
app.listen(port, function (){
    console.log(`Server is runing on port ${port}`)
});