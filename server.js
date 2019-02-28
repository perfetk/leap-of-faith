const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const notesUri = 'mongodb://notes:notes123!@ds145484.mlab.com:45484/notes_db';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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
    db.collection('notes').find().toArray((err, result) => {
        console.log(result);
    })
});

app.post('/notes', (req,res) => {
    db.collection('notes').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/')
      })
});

app.put('/notes', (req, res) => {
    db.collection('notes').findOneAndUpdate({title: 'test'}, {
        $set: {
            title: req.body.title,
            message: req.body.message
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
})