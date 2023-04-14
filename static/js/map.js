
let myMap = L.map("map", {
    center: [44.9778, -93.2650],
    zoom: 9
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let queryUrl = 'http://127.0.0.1:5000/';
let blockGroupsUrl = 'http://127.0.0.1:5000/blockGroups'

d3.json(queryUrl).then(function (data) {
    //console.log(data);
    makeMap(data);
    //createGroupedMap(data);
});

function makeMap(data){

    //console.log(data.length);
    console.log(data[0]);
    //console.log(data[0].lat);

    for (let i = 0; i < data.length; i++) {
        let home = data[i];
        let coordinates = [home.lat, home.lon];

        //console.log(coordinates);
        L.marker(coordinates)
            .bindPopup(`<h1>${home.address_full}</h1> <hr> <h3>Fastest Speed Down ${home.fastest_speed_down}</h3>`)
            .addTo(myMap);
      }

    //myMap.addLayer(markers);
};

function createGroupedMap(data){
    L.polygon([
        [33.7490, -84.3880],
        [32.0809, -81.0912],
        [30.3322, -81.6557],
        [32.3792, -86.3077]
      ], {
        color: "purple",
        fillColor: "purple",
        fillOpacity: 0.75
      }).addTo(myMap);
};


  

