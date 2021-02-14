const addReviewToBusiness = (req, res, db) => {
    const { businessId } = req.params;
    const { name, content, rating } = req.body;

    if(!content) {
        return res.status(400).json('form submission failed');
    }

    db('reviews')
    .returning('*')
    .insert({
        businessid: businessId,
        name: name,
        content: content,
        rating: rating
    })
    .then(review => {
        return db.select('*').from('reviews').where({ businessid: review[0].businessid })
        .then(reviews => res.json(reviews))
    })
    .catch(err => res.status(400).json('unable to post review'));
}

const retriveBusinessReviews = (req, res, db) => {
    const { businessId } = req.params;
    db.select('*').from('reviews')
    .where({ businessid: businessId })
    .then(reviews => res.json(reviews))
    .catch(err => res.status(400).json('unable to retrive reviews'));
}

module.exports = {
    addReviewToBusiness: addReviewToBusiness,
    retriveBusinessReviews: retriveBusinessReviews
}