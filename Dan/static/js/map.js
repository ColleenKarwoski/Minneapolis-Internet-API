
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
});


function createGroupedMap(data){

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
      }).bindPopup(`<h3>Redlining Grade - ${grade}</h3><hr>
                    <p>Income Level: ${row.income_level}</p>
                    <p>Speed Down Bin: ${row.speed_down_bins}</p>` 
        ).addTo(myMap);
  }

  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'mapLegend');
    labels = ['<strong>Redlining Grade</strong>'];
    bins = ['A','B','C','D','N/A'];

    labels.push("<table>");

    for (let i = 0; i < bins.length; i++) {

            labels.push(
                            '<tr><td style="background-color: '
                             + getColor(bins[i]) + '; width: 50px;">&nbsp;</td>' 
                             + '<td>' + bins[i] + "</td></tr>")

            //console.log(labels);
            
        }
        labels.push("</table>");
        div.innerHTML = labels.join('');
        
        //console.log(div);

    return div;
    };

legend.addTo(myMap);

};

function getColor(c) {
  return c === 'D'  ? "#2a4858" :
         c === 'C'  ? "#005aae" :
         c === 'B' ? "#008a99" :
         c === 'A' ? "#34fa59" :
                          "#616262";
}

function getOpacity(o){
  return o === 'D'  ? 0.75 :
         o === 'C'  ? 0.8 :
         o === 'B' ? 0.9 :
         o === 'A' ? 1 :
                          0.7;
}


  

