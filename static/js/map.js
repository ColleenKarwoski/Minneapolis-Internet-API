
let queryUrl = 'http://127.0.0.1:5000/'

d3.json(queryUrl).then(function (data) {
    console.log(data)
});

let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

