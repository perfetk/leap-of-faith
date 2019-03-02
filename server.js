const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const notesUri = '';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let db;

const notes = []

MongoClient.connect(notesUri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('notes_db');
    app.listen(port, () => {
      console.log('listening on 3000')
    })
  })

app.get('/', (req, res) => {
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

app.delete('/notes', (req, res) => {
    db.collection('notes').findOneAndDelete({title: req.body.title}, 
        (err, result) => {
            if (err) return res.send(err);
            res.send(result)
          })
})
