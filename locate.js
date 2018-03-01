window.onload = getMyLocation;

function getMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayLocation, displayError);
  } else {
    alert("Geolocation not supported in your browser");
  }
}

function displayLocation(position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  var div = document.getElementById('location');
  var accuracy = document.getElementById("accuracy");
  
  div.innerHTML = "You are at " + lat + " and " + long + " longitude";
  accuracy.innerHTML = " (with " + position.coords.accuracy + " meters accuracy)";
  
  var km = computeDistance(position.coords, ourCoords);
  var distance = document.getElementById('distance');
  distance.innerHTML = "You are " + km + " km from the authors location.";
  console.log(position.coords, "<-position.coords");
  showMap(position.coords);
}

function displayError(error) {
  var errorTypes = {
    0: "Unknown error",
    1: "Permission denied by user",
    2: "Position is not avaliable",
    3: "Request timed out"
  };
  
  var errorMessage = errorTypes[error.code];
  if (error.code == 0 || error.code == 2) {
    errorMessage = errorMessage + " " + error.message;
  }
  
  var div = document.getElementById("location");
  div.innerHTML = errorMessage;
}

function computeDistance(startCoords, destCoords) {
  var startLatRads = degreesToRadians(startCoords.latitude);
  var startLongRads = degreesToRadians(startCoords.longitude);
  var destLatRads = degreesToRadians(destCoords.latitude);
  var destLongRads = degreesToRadians(destCoords.longitude);
  
  var Radius = 6371;
  
  var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
                  Math.cos(startLatRads) * Math.cos(destLatRads) *
                  Math.cos(startLongRads - destLongRads)) * Radius;
  return  distance;
}

function degreesToRadians(degrees) {
  var radians = (degrees * Math.PI) / 180;
  return radians;
}

var ourCoords = {
  latitude: 47.624851,
  longitude: -122.52099
};

var map;

function showMap(coords) {
  var googleLatAndLong = 
    new google.maps.LatLng(coords.latitude, coords.longitude);
  
  var mapOptions = {
    zoom: 10,
    center: googleLatAndLong,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  var mapDiv = document.getElementById("map");
  map = new google.maps.Map(mapDiv, mapOptions);
  var title = "Your Location";
  var content = "You are here: " + coords.latitude + ", " + coords.longitude;
  addMarker(map, googleLatAndLong, title, content);
}

function addMarker(map, latlong, title, content) {
  var markerOptions = {
    position: latlong,
    map: map,
    title: title,
    clickable: true
  };
  
  var marker = new google.maps.Marker(markerOptions);
  
  var infoWindowOptions = {
    content: content,
    position: latlong
  };
  
  var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
  
  google.maps.event.addListener(marker, "click", function() {
    infoWindow.open(map);
  });
}