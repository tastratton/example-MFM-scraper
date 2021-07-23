# example: data table scraper

- Since the data request we are accessing is not set up with a CORS policy header, we can't practically retrieve the data using only client side code.  It's possible to retrieve the data only in client side javascript by disabling your browser security (e.g. chrome switches to --disable-web-security) but this isn't practical outside illustration or some development troubleshooting workflows.

- In addition, there could be data elements (e.g. an ID or token assigned by vendor) which we may not want exposed in the publicly accessible client side code.  These will be safeguarded by placing them only in non-accessible server side code.

```textart

---client---       ----server code----             ---vendor service---
browser initiate--->serve page
                          |
                    secret only on server
                          | 
                    server program
                          |
                    send request
                          +---------------------> process secret
                                                        |
                                                   return data
                                                        |
display data <------reformat data <---------------------+
```

- Since browsers restrict cross site request, in order to get the data, we will need server side code to make the data request.

- This example will use node as the server side component.

## Steps to get running

- install node LTS version (this was built on 14.17.3 LTS)
- npm install express nodemon node-fetch
  - //cors body-parser not used.  TODO: verify
- make a folder in this directory "temp" and comp example-privateKeys.js into it.
  - rename example-privateKeys.js to privateKeys.js
  - edit the new file /temp/privateKeys.js and replace the placeholder string with your vendor issued ID.
- run runme.sh or similar command for your OS platform to start the node server.
- (optional) if you want to see the client-server version of the javascript code "work", you need to run your browser with command line options to disable normal security.  If you do this make sure you don't browse anything else on the web in this browser while it is like this!  See / run chromeDevMode.sh for command line to do this.  NOTE: this is for educational purposes only, do not attempt this on a real internet page!
- assuming your node server started - open http://localhost:3000 and check out the examples.
- if you are running the /client/localonly-hellorates.html demo, you will need to enter your MFM id into the page to connect (because there is no server side code).  If your browser is in "security disabled" mode, the request should complete.  If your browser is running normally, you will most likely see a CORS error response in the developer console of your web browser, ad data will not load.  This is working as intended by the vendor (and the interne) - this is not an unrestricted, publicly consumable api.
- if you go to /loadRates, you will initiate a server side request to get the data from the vendor using the mfm ID in temp/privateKeys.js.  If all is set up correctly this should display the rate table.  Note that there may be some differences in how the data is loaded from the server side and the client side... the user agent on the client side (your browser) may be given a different response than the server side node user agent when it retrieves the data.
- if you go to /client/clientserver-hellorates.html, it should load the data and restyle it (if /loadRates is working).