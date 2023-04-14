
let myMap = L.map("map", {
    center: [44.9778, -93.2650],
    zoom: 9
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let queryUrl = 'http://127.0.0.1:5000/';

d3.json(queryUrl).then(function (data) {
    //console.log(data);
    makeMap(data);
});

function makeMap(data){

    //console.log(data.length);
    console.log(data[0]);
    //console.log(data[0].lat);

    // let markers = L.markerClusterGroup();

    for (let i = 0; i < data.length; i++) {
        let home = data[i];
        let coordinates = [home.lat, home.lon];

        //console.log(coordinates);
        L.marker(coordinates)
            .bindPopup(`<h1>${home.address_full}</h1> <hr> <h3>Fastest Speed Down ${home.fastest_speed_down}</h3>`)
            .addTo(myMap);
          //.bindPopup(`<h1>${city.name}</h1> <hr> <h3>Population ${city.population.toLocaleString()}</h3>`)
          
        // markers.addLayer(L.marker(coordinates)
        // .bindPopup(`<h1>${home.address_full}</h1> <hr> <h3>Fastest Speed Down ${home.fastest_speed_down}</h3>`));
      }

    //myMap.addLayer(markers);
};

function createMap(homes){

};


  

