const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const salt = 10;
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'yelp'
    }
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json(database);
});

//Restful routing
// post signin
app.post('/signin', (req, res) => {
    const { password, email } = req.body;
    db.select('email', 'hash').from('login')
    .where({
        email: email
    })
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid) {
            return db.select('*').from('users')
            .where({
                email: data[0].email
            })
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('User Not Found'));
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'));
});

// post register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, salt);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0],
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(404).json('unable to register'));
});

// get businesses
app.get('/businesses', (req, res) => {
    db.select('*').from('businesses')
    .then(busniesses => res.json(busniesses))
    .catch(() => res.status(400).json('unable to retrive data'));
});

// post add business
app.post('/business', (req, res) => {
    db('businesses')
    .returning('*')
    .insert({
        name: req.body.name,
        country: req.body.country,
        city: req.body.city,
        street: req.body.street,
        picture: req.body.picture,
        category: req.body.category,
        description: req.body.description,
        phonenumber: req.body.phoneNumber
    })
    .then(business => res.json(business[0]))
    .catch(err => {
        res.status(400).json('unable to add new business');
    });
});

// get buisness
app.get('/business/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('businesses')
    .where({ id })
    .then(business => {
        if(business.length) {
            res.json(business[0]);
        } else {
             res.status(404).json('not found');
        }
    })
    .catch(err => res.status(400).json('error getting business'));
});

// post review
app.post('/review/:businessId', (req, res) => {
    const { businessId } = req.params;
    db('reviews')
    .returning('*')
    .insert({
        businessid: businessId,
        name: req.body.name,
        content: req.body.content,
        rating: req.body.rating
    })
    .then(review => {
        return db.select('*').from('reviews').where({ businessid: review[0].businessid })
        .then(reviews => res.json(reviews))
    })
    .catch(err => res.status(400).json('unable to post review'));
});

// get reviews of business
app.get('/review/:businessId', (req, res) => {
    const { businessId } = req.params;
    db.select('*').from('reviews')
    .where({ businessid: businessId })
    .then(reviews => res.json(reviews))
    .catch(err => res.status(400).json('unable to retrive reviews'));
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});