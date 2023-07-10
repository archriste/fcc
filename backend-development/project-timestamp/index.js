// index.js

var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/", function (req, res) {
  const dateNow = new Date(Date.now());
  let returnString = dateNow.toUTCString();
  let timestamp = dateNow.getTime();
  res.json({"unix":timestamp, "utc":returnString})
});

app.get("/api/:date", function (req, res) {
  
  const regex = new RegExp('^[0-9]+$')
  let dateFromURL = req.params.date;
  let parsedDate;

  let parsedDateObject = new Date(dateFromURL);
  
  if(isNaN(parsedDateObject)){
    if(regex.test(dateFromURL)) {
      parsedDate = parseInt(dateFromURL);
    } else {
      parsedDate = `${dateFromURL}T00:00:00`;
    }
  
    parsedDateObject = new Date(parsedDate);
  }

  if(isNaN(parsedDateObject)) {
    return res.json({"error":"Invalid Date"})
  }

  let returnString = parsedDateObject.toUTCString();
  let timestamp = parsedDateObject.getTime();
  
  res.json({"unix":timestamp, "utc":returnString})
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
