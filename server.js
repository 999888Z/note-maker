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

// get route for all notes
app.get('/api/notes', (req, res) => {
  res.send(JSON.parse(fs.readFileSync("./db/db.json","utf8")))
});

// post route to push a note
app.post('/api/notes', (req, res) => {
  const addToList = req.body
  addToList.id = uuid ()
  const info = JSON.parse(fs.readFileSync("./db/db.json","utf8"))
  info.push(addToList)
  fs.writeFileSync("./db/db.json",JSON.stringify(info))
  res.json(info)
})

// delete route for targeted id coming from 'id' parameter
app.delete(`/api/notes/:id`, (req, res) => {
  console.log(req.params.id)

  // getting the targeted id to delete
  const chosenID = req.params.id;

  // defining entire notes array from db.json
  const notes = JSON.parse(fs.readFileSync("./db/db.json","utf8"));

  // filter out a single element from notes array that matches to 'id' of chosenID
  const deletedNote = notes.filter((note) => {
    return note.id === chosenID;
  })

  // getting an index of deletedNote from notes array
  const indexOfDeletedNote = notes.indexOf(deletedNote);

  // deleting the selected note that's positioned in indexOfDeletedNote(index) of notes array
  notes.splice(indexOfDeletedNote, 1);

  // update db.json with new notes array
  fs.writeFileSync("./db/db.json", JSON.stringify(notes), "utf-8");
  res.json(notes);
})


app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);