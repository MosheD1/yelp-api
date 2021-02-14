const retriveAllBusinesses = (req, res, db) => {
    db.select('*').from('businesses')
    .then(busniesses => res.json(busniesses))
    .catch(() => res.status(400).json('unable to retrive data'));
}

const retriveBusiness = (req, res, db) => {
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
}

const addBusinessToDB = (req, res, db) => {

    if(!req.body.name || !req.body.picture) {
        return res.status(400).json('form submission failed');
    }
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
}

module.exports = {
    retriveAllBusinesses: retriveAllBusinesses,
    retriveBusiness: retriveBusiness,
    addBusinessToDB: addBusinessToDB
}