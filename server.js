const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const connectionString = 'mongodb+srv://hiepdvgcs210944:gXzSOHyt3townFC0@cluster0.y682z3s.mongodb.net/';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');

        const db = client.db('ATN');
        const toysCollection = db.collection('toys');

        app.set('view engine', 'ejs');
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('public'));
        app.use(express.json());

        app.get('/', (req, res) => {
            toysCollection
                .find()
                .toArray()
                .then(results => {
                    console.log(results);
                    res.render('pages/index', { toys: results });
                })
                .catch(error => console.error(error));
        });

        app.get('/add', (req, res) => {
            res.render('pages/add');
        });

        app.post('/save', (req, res) => {
            toysCollection
                .insertOne(req.body)
                .then(result => {
                    console.log(result);
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        });

        app.get('/edit/:id', (req, res) => {
            const toyId = req.params.id;
            toysCollection
                .findOne({ _id: new ObjectId(toyId) })
                .then(toy => {
                    res.render('pages/edit', { toy: toy });
                })
                .catch(error => console.error(error));
        });

        app.post('/edit/:id', (req, res) => {
            const toyId = req.params.id;
            toysCollection
                .findOneAndUpdate(
                    { _id: new ObjectId(toyId) },
                    {
                        $set: {
                            name: req.body.name,
                            price: req.body.price,
                            image: req.body.image
                        }
                    },
                    { useFindAndModify: false }
                )
                .then(result => {
                    console.log(result);
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        });

        app.get('/delete/:id', (req, res) => {
            const toyId = req.params.id;
            toysCollection
                .findOneAndDelete({ _id: new ObjectId(toyId) })
                .then(result => {
                    console.log(result);
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        });

        app.listen(8080, () => {
            console.log('listening on 8080');
        });
    });
