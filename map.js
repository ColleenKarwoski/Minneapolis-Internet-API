
// const sqlite3 = require('sqlite3').verbose();

// let db = new sqlite3.Database('Data/isp.sqlite', sqlite3.OPEN_READONLY, (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Connected to the isp database.');
//   });

let selected_tbl_name = 'Minneapolis_Centurylink'

(async () => {
    let res=await fetch('Data/isp.sqlite');
    let arrayBuffer=await res.arrayBuffer();
    let uInt8Array=new Uint8Array(arrayBuffer);
    let db=new SQL.Database(uInt8Array);
})();

function extractTableJSONRecords() {
    let stmt='SELECT * FROM `' + selected_tbl_name + '`';
    let resultset = db.exec(stmt);
    let columns=resultset[0]['columns'];
    let values=resultset[0]['values'];
    let jsonOutput=[];
    for(let valArr of values) {
      let obj={};
      for(let v in valArr) {
        obj[columns[v]]=valArr[v];
      }
      jsonOutput.push(obj);
    }
    return jsonOutput;
}


// let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// })

