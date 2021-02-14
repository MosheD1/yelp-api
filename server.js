const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');

const register = require('./Routes/register');
const signin = require('./Routes/signin');
const business = require('./Routes/business');
const review = require('./Routes/review');

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
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

// post register
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

// get businesses
app.get('/businesses', (req, res) => {business.retriveAllBusinesses(req, res, db)});

// post add business
app.post('/business', (req, res) => {business.addBusinessToDB(req, res, db)});

// get buisness
app.get('/business/:id', (req, res) => {business.retriveBusiness(req, res, db)});

// post review
app.post('/review/:businessId', (req, res) => {review.addReviewToBusiness(req, res, db)});

// get reviews of business
app.get('/review/:businessId', (req, res) => {review.retriveBusinessReviews(req, res, db)});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});