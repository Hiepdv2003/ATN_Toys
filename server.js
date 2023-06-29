const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient

const connectionString = 'mongodb+srv://hiepdvgcs210944:gXzSOHyt3townFC0@cluster0.y682z3s.mongodb.net/'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')

        const db = client.db('ATN')
        const toysCollection = db.collection('toys')

        app.set('view engine', 'ejs')

        app.use(bodyParser.urlencoded({ extended: true }))

        app.use(express.static('public'))

        app.use(bodyParser.json())

        app.get('/', (req, res) => {
            toysCollection.find().toArray()
                .then(results => {
                    console.log(results)
                    res.render('pages/index', { toys: results })
                })
                .catch(error => console.error(error))
        })

        app.get('/add', function (req, res) {
            res.render('pages/add');
        })

        app.post('/save', (req, res) => {
            toysCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/add')
                })
                .catch(error => console.error(error))
        })

        app.get('/edit/:id', function (req, res) {
            const toyId = parseInt(req.params.id);
            toysCollection.findOne({ toyId: toyId })
                .then(toy => {
                    res.render('pages/edit', { toy: toy });
                })
                .catch(error => console.error(error));
        })

        app.post('/edit/:id', (req, res) => {
            const toyId = parseInt(req.params.id);
            toysCollection.findOneAndUpdate(
                { toyId: toyId },
                {
                    $set: {
                        name: req.body.name,
                        price: req.body.price
                    }
                },
                { useFindAndModify: false }
            )
                .then(result => res.json('Updated Successfully'))
                .catch(error => console.error(error))
        })

        app.delete('/delete/:id', (req, res) => {
            const toyId = parseInt(req.params.id);
            toysCollection.findOneAndDelete(
                { toyId: toyId },
                { useFindAndModify: false }
            )
                .then(result => {
                    res.json('Deleted Successfully')
                })
                .catch(error => console.error(error))
        })

        app.listen(8080, function () {
            console.log('listening on 8080')
        })
    })