const express = require('express');

const app = express();

const data = [
 { id: 1, name: 'name-1' },
 { id: 2, name: 'name-2' },
 { id: 3, name: 'name-3' },
 { id: 4, name: 'name-4' },
];

app.get("/items", (req, res) => {

 // ids = "" -> default value
 const { ids = "" } = req.query;

 const splitedIds = ids.split(','); // "2,3,4" => ["2","3","4"]
 const paresdIds = splitedIds.map(e => parseInt(e, 10)); // ["2","3","4"] => [2,3,4]

 const result = data.filter(e => paresdIds.includes(e.id));

 return res.status(200).send(result);
});

app.listen(8080, () => {
 console.log("Server was started on 8080");
});

console.log("Server start");