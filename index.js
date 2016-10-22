console.log('May Node be with you' + __dirname )

const express = require('express');
const bodyParser= require('body-parser')
var request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use('/static', express.static('static'));

//To server service-worker & manifest assests in root dir
app.use(express.static(__dirname));

app.set('view engine', 'ejs')

app.get('/', function (request, response) {
  console.log('in get')
  response.send("hello world")
})


app.get('/html', function (request, response) {
  console.log('in get of html')
  response.render(__dirname + '/index.ejs')
})


app.get('/manifest.json', function (request, response) {
  console.log('in get of manifest')
  response.sendFile('/manifest.json' , { root : __dirname});
})

app.get('/logo.png', function (request, response) {
  console.log('in get of logo')
  response.sendFile('/logo.png' , { root : __dirname});
})

app.get('/findForRoute', function (req, res) {
  console.log(req.body)
  //https://fox.klm.com/fox/json/flightstatuses?originAirportCode=AMS&destinationAirportCode=CDG
  var url = 'http://fox.klm.com/fox/json/flightstatuses?originAirportCode=' + req.query.from + '&destinationAirportCode=' + req.query.to;
  console.log(url)
  request.get({ url: url}, function (error, response, body) {
		// console.log(body)
		  if (!error && response.statusCode == 200) { 
			  var obj = JSON.parse(body);
			  var result = []
			  console.log("found");
			  for(var i = 0, l = obj.flights.length; i < l; i++) {
				  //console.log(obj.flights[i].flightNumber)
				  
				  
				  //result.push(obj.flights[i].flightNumber)
				  result.push({"flightNumber":obj.flights[i].carrier.code + " " + obj.flights[i].flightNumber, 
				  "departureDate":obj.flights[i].operatingFlightLeg.scheduledDepartureDateTime,
				  "flightStatus":obj.flights[i].operatingFlightLeg.flightStatus});
			  }
			  res.send({"flights": result}); 
			 // console.log(result[0].a)
		  }
		  else {
			  res.redirect("/failed")
		  }
	}); 
})

app.get('/failed', function (req, res) {
  console.log('in done')
  res.send("failed")
})

app.listen(3001, function() {
  console.log('listening on 3001')
})