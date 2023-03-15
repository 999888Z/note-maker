const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json')
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) => {
  res.send(JSON.parse(fs.readFileSync("./db/db.json","utf8")))
});

app.post('/api/notes', (req, res) => {
const addToList = req.body
addToList.id = uuid ()
const info = JSON.parse(fs.readFileSync("./db/db.json","utf8"))
info.push(addToList)
fs.writeFileSync("./db/db.json",JSON.stringify(info))
res.json(info)
})

app.delete(`/api/notes/:id`, (req, res) => {
    console.log(req.params.id)
})


app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);