const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const notesUri = 'mongodb://notes:notes123!@ds145484.mlab.com:45484/notes_db';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
// const notes = [];
// const note = {
//     title: 'test title',
//     content: 'lorem ipsum'
// }

let db;
MongoClient.connect(notesUri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('notes_db') // whatever your database name is
    app.listen(port, () => {
      console.log('listening on 3000')
    })
  })

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    db.collection('notes').find().toArray(function(err,result) {
        console.log(result);
    })
});

app.post('/notes', (req,res) => {
    db.collection('notes').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/')
      })
});

