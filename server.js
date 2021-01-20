const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const salt = 10;

const database = {
    users: [
        {
            id: '1',
            name: 'moshe',
            email: 'moshe@gmail.com',
            password: '123',
            joined: new Date()
        },
        {
            id: '2',
            name: 'aviv',
            email: 'aviv@gmail.com',
            password: '123',
            joined: new Date()
        },
        {
            id: '3',
            name: 'gili',
            email: 'gili@gmail.com',
            password: '123',
            joined: new Date()
        },
        {
            id: '4',
            name: 'eli',
            email: 'eli@gmail.com',
            password: '123',
            joined: new Date()
        }
    ],
    busniesses: [
        {
            id: '1',
            name: 'moshe\'s place',
            country: 'israel',
            city: 'rehovot',
            street: 'Herzel 123',
            picture: 'https://images.unsplash.com/photo-1609253119912-b3cee27b7ef8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
            category: 'food',
            description: 'best food in town, there are many great dishes, professional staff and great prices',
            phoneNumber: '054-85963XX'
        },
        {
            id: '2',
            name: 'Surf School',
            country: 'israel',
            city: 'tel-aviv',
            street: 'Herzel 543',
            picture: 'https://images.unsplash.com/photo-1609253119912-b3cee27b7ef8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
            category: 'sport',
            description: 'best surf school in town, there are many great teacher, great weather and fun activities',
            phoneNumber: '052-85963XX'
        }
    ],
    reviews: [
        {
            id: '1',
            businessId: '1',
            name: 'moshe',
            content: 'great restaurant, go check it out',
            rating: 0
        },
        {
            id: '2',
            businessId: '2',
            name: 'moshe',
            content: 'one of the best surf schools in the world',
            rating: 0
        }
    ]
};

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
    let found = false;
    database.users.forEach(user => {
        if(user.email === email && user.password === password) {
            found = true;
            return res.status(200).json(user);
        }
    });

    if(!found) {
        res.status(404).json('User Not Found');
    }
});

// post register
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    database.users.push({
        id: database.users.length + 1,
        name: name,
        email: email,
        password: password,
        joined: new Date()
    });

    res.status(200).json(database.users[database.users.length - 1]);
});

// get businesses
app.get('/businesses', (req, res) => {
    res.json(database.busniesses);
});

// post add business
app.post('/business', (req, res) => {
    database.busniesses.push({
        id: `${database.busniesses.length + 1}`,
        name: req.body.name,
        country: req.body.country,
        city: req.body.city,
        street: req.body.street,
        picture: req.body.picture,
        category: req.body.category,
        description: req.body.description,
        phoneNumber: req.body.phoneNumber
    });

    res.json(database.busniesses[database.busniesses.length - 1]);
});

// get buisness
app.get('/business/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.busniesses.forEach(b => {
        if(id === b.id) {
            found = true;
            return res.json(b);
        }
    });

    if(!found) {
        return res.status(404).json('not found');
    }
});

// post review
app.post('/review/:businessId', (req, res) => {
    const { businessId } = req.params;
    database.reviews.push({
        id: `${database.reviews.length + 1}`,
        businessId: businessId,
        name: req.body.name,
        content: req.body.content

    });

    const updatedReviews = database.reviews.filter(r => r.businessId === businessId);
    res.json(updatedReviews);
});

// get reviews of business
app.get('/review/:businessId', (req, res) => {
    const { businessId } = req.params;
    const reviews = database.reviews.filter(c => {
        return businessId === c.businessId;
    });

    res.json(reviews);
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});