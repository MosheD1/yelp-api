const handleSignin = (req, res, db, bcrypt) => {
    const { password, email } = req.body;

    if(!email || !password) {
        return res.status(400).json('form submission failed');
    }

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
}

module.exports = {
    handleSignin: handleSignin
}