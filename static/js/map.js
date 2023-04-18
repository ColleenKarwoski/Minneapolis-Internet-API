
// [44.9778, -93.2650]

let myMap = L.map("map", {
    center: [44.966278, -93.267823],
    zoom: 12
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let queryUrl = 'http://127.0.0.1:5000/';
let blockGroupsUrl = 'http://127.0.0.1:5000/blockGroups'

d3.json(blockGroupsUrl).then(function (data) {
    //console.log(data);
    createGroupedMap(data);
    //createGroupedMap(data);
});

function makeMap(data){

    //console.log(data.length);
    //console.log(data[0]);
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
  //console.log(data)

  //console.log(data[0]['latstring'].length)

  for(let i = 0; i < data.length; i++){

    let row = data[i];

    //console.log(row)

    let coordinates = [];

    let grade = row.redlining_grade

    let rowColor = getColor(grade);
    let opacity = getOpacity(grade)

    //console.log(rowColor)

    // console.log(row.latstring.length)    
    // console.log(row.lonstring.length)

    for(let c = 0; c < row.latstring.length; c++){
      //let latlng = L.LatLng(row.latstring[c], row.lonstring[c])
      //coordinates.push(latlng)
      coordinates.push([row.latstring[c], row.lonstring[c]])
    };

    coordinates.sort(function(a,b){
      // console.log(a)
      // console.log(b)
      return a[0] - b[0] || b[1] - a[1];
    });

    //console.log(coordinates)
    
    //console.log(L.latlng([coordinates]))

    L.polygon([coordinates], 
      {
        color: rowColor,
        opacity: opacity,
        fillColor: rowColor,
        fillOpacity: opacity
      }).addTo(myMap);
  }
};

function getColor(c) {
  return c === 'D'  ? "#b56f00" :
         c === 'C'  ? "#7d8400" :
         c === 'B' ? "#8bb300" :
         c === 'A' ? "#57c73a" :
                          "#616262";
}

function getOpacity(o){
  return o === 'D'  ? 0.75 :
         o === 'C'  ? 0.8 :
         o === 'B' ? 0.9 :
         o === 'A' ? 1 :
                          0.7;
}


  

