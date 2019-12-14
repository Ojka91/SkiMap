mapboxgl.accessToken =
    'pk.eyJ1Ijoib2prYTkxIiwiYSI6ImNrMTNuMnpwaDBhOTUzY3Fqd2x1czN2MngifQ.JptQgBADc6-MntgYZ3woDA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ojka91/ck3lvi9bc0o621cq6j35z6rd6',
    center: [-90.96, -0.47],
    zoom: 8
});

var geojson = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-77.032, 38.913]
        },
        properties: {
            title: '',
            description: "",
        }
    }],
}

var markers =[];
var getLocationPosition;
var userName;
var updatePositionInterval;
var message = {
    user: '',
    long: '',
    lat: '',
}
var isLogging = true;
var logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", function(){
    loginBtn.style.display = "block";
    logoutBtn.style.display = 'none';
    logout();
});

var loginBtn = document.getElementById("login");
loginBtn.addEventListener("click", function () {
    loginBtn.style.display = "none";
    logoutBtn.style.display = 'block';
    login();
});


function login() {
    // https://firebase.google.com/docs/auth/web/google-signin

    // Provider
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        console.log("Logged in " + result)
        // Add geolocate control to the map.
/*map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    trackUserLocation: true
    }));
  */     
 getInfo();
 getLocationPosition = navigator.geolocation.watchPosition(getLocation, errorHandler);


    }).catch(function (err) {
        console.log(err);
        console.log("Error");
    });
};

function errorHandler(){
    alert("Error retreieving geolocation data")

}

function logout() {
    navigator.geolocation.clearWatch(getLocation)
    firebase.database().ref('location/'+userName).remove();  

    firebase.auth().signOut().then(function (result) {
        console.log("Logged out " + result)
        isLogging = true;

      

        // Sign-out successful.
    }, function (error) {
        console.log("error lgin out")
        console.log(error)
        // An error happened.
    });
};

// https://firebase.google.com/docs/database/web/read-and-write
function updateLocation() {

    console.log("Update message")
    firebase.database().ref('location/'+userName).set(message)

    ref = firebase.database().ref('location/'+firebase.auth().currentUser.displayName)
    ref.on('child_changed', function(childSnapshot, prevChildKey) {
      getInfo();
    });
};




function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    lng = position.coords.longitude;
    lat = position.coords.latitude;
    center = new mapboxgl.LngLat(lng, lat);
    if (isLogging) {
        map.setZoom(14);
        map.setCenter(center);
        isLogging = false;
    }

   
    message.user = firebase.auth().currentUser.displayName;
    userName = firebase.auth().currentUser.displayName;
    message.lat = this.lat;
    message.long = this.lng;
    updateLocation();
    console.log(position);
}


function addMarkers(long, lat, name) {
    console.log("adding marker")
    // add markers to map
    geojson.features.forEach(function (marker) {

        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({
                    offset: 25
                }) // add popups
                .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
            .addTo(map);
    });


}


function getInfo () {

    firebase.database().ref('location/').on('value', function (data) {
        
        var messages = data.val();
        markers = [];

        for (var key in messages) {
          
            var element = messages[key];
            geojson.features[0].geometry.coordinates =  new mapboxgl.LngLat(element.long, element.lat);
            geojson.features[0].properties.title = element.user;
            markers.push(geojson);
           addMarkers(element.long, element.lat, element.user)
        }
       
        console.log(messages)
    })


};