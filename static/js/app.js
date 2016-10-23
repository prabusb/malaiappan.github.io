 var searches = [];
 
 if ('serviceWorker' in navigator) {
    navigator.serviceWorker
         .register('service-worker.js', {scope: './'})
       .then(function() { console.log('Service Worker Registered'); });
  }
  
document.getElementById("viewoffers").addEventListener('click', function() {
    getDataOnSubmit();
  });
  
  
document.getElementById("viewRecentSearch").addEventListener('click', function() {
    // Open/show the add new city dialog
    showMySearches();
  });
  
showMySearches = function() {
	  var searchedRoutes = JSON.parse(localStorage.searchedRoutes)
	  console.log(searchedRoutes)
	  var html = "<table  class=\"striped\" ><thead><tr><th data-field=\"id\">From</th><th data-field=\"name\">To</th><th data-field=\"price\">Date</th><th data-field=\"price\">Search again</th><th></th></tr></thead><tbody>";
	  for(var i = 0, l = searchedRoutes.length; i < l; i++) {
		  console.log(searchedRoutes[i].from)
    		html = html + "<tr><td>" + searchedRoutes[i].from + "</td><td>" + searchedRoutes[i].to + "</td><td>" + searchedRoutes[i].date + "</td><td><a href=" + searchedRoutes[i].url + "\" id=\"btnmod\" class=\"waves-effect waves-light btn\"><i class=\"material-icons center\">replay</i></a></td></tr>";
			//html = html + "<a href=\"http://localhost:3001/\">asdf</a>"
	  }
	  document.getElementById("recentSearches").innerHTML = html + "</tbody></table>"; 
}
  
saveSearches = function() {
    var searchedRoutes = JSON.stringify(searches);
    localStorage.searchedRoutes = searchedRoutes;
};

searchAgain = function(obj) {
	var url = obj.getAttribute("href");
	getData(url);
}

getDataOnSubmit = function () {
	var from = document.getElementById("from").value;
	var to = document.getElementById("to").value;
	var date = document.getElementById("date").value;
	var url = 'https://flightmock.scalingo.io/flights/' + from + '/' + to + '/' + date;
	
	searches.push({"from":from, "to":to, "date":date, "url":url})
	saveSearches();
	
	getData(url);
}

getDataFromLocalStorage = function () {
	var searchedRoutes = JSON.parse(localStorage.searchedRoutes)
	var length = searchedRoutes.length;
		
	var url = searchedRoutes[length-1].url;
	
	getData(url);
}
  
getData = function(url) {
	
   // var url = 'https://flightmock.scalingo.io/flights/' + from + '/' + to + '/' + date;
	
    if ('caches' in window) {
      /*
       * Check if the service worker has already cached this  data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data.
       */
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
		  console.log("from cache" + json)
		  console.log("cache size" + json.length)
		 var html = "<table  class=\"striped\" ><thead><tr><th data-field=\"id\">From</th><th data-field=\"name\">To</th><th data-field=\"price\">Date</th><th data-field=\"price\">Time</th><th data-field=\"price\">Price</th><th></th></tr></thead><tbody>";
		 for(var i = 0, l = json.length; i < l; i++) {
			html = html + "<tr><td>" + json[i].departureSation.stationCode + "</td><td>" + json[i].arrivalStation.stationCode + "</td><td>" + json[i].departureDate + "</td><td>" + json[i].departureTime + "</td><td>" + json[i].price.currency + " " + json[i].price.price + "</td><td> <a  id=\"btnmod\" class=\"waves-effect waves-light btn\">Book</a></td>";
		 }
		 document.getElementById("flightinfo").innerHTML = html + "</tbody></table>"
		 console.log("filled from cache")
		  return;
          });
        }
      });
    }
    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
	  console.log("from request" + response)
	  console.log("size from network" + response.length)
		  
	  var html = "<table  class=\"striped\" ><thead><tr><th data-field=\"id\">From</th><th data-field=\"name\">To</th><th data-field=\"price\">Date</th><th data-field=\"price\">Time</th><th data-field=\"price\">Price</th><th></th></tr></thead><tbody>";
	   for(var i = 0, l = response.length; i < l; i++) {
		html = html + "<tr><td>" + response[i].departureSation.stationCode + "</td><td>" + response[i].arrivalStation.stationCode + "</td><td>" + response[i].departureDate + "</td><td>" + response[i].departureTime + "</td><td>" + response[i].price.currency + " " + response[i].price.price + "</td><td> <a  id=\"btnmod\" class=\"waves-effect waves-light btn\">Book</a></td>";
	   }
	   document.getElementById("flightinfo").innerHTML = html + "</tbody></table>"
	   console.log("filled from network")
       }
      } else {
	 console.log("error for " + url)
      }
    };
    request.open('GET', url);
    request.send();
  };

 
